// src/usecases/FinancialSuggestionService.ts
import { PrismaClient, Planning } from "@prisma/client";

const prisma = new PrismaClient();

type MovementData = {
  type: "positive" | "negative";
  value: number;
  frequency: "one_time" | "monthly" | "yearly";
  date: Date;
};

/**
 * Gera sugestões para alcançar a meta do planejamento até a data alvo,
 * considerando taxa anual real composta e eventos financeiros (movements).
 */
export async function generateSuggestions(
  planningId: string,
  annualReturnRate = 0.04 // 4% ao ano
) {
  // Busca o planejamento e seus movimentos no banco
  const planning = await prisma.planning.findUnique({
    where: { id: planningId },
    include: { movements: true },
  });

  if (!planning) {
    throw new Error("Planejamento não encontrado");
  }

  // Mapeia movimentos para o formato usado nos cálculos
  const movements: MovementData[] = planning.movements.map((mv) => ({
    type: mv.type === "positive" ? "positive" : "negative",
    value: mv.value,
    frequency: mv.frequency,
    date: mv.date,
  }));

  const now = new Date();
  const targetDate = planning.targetDate;
  const totalAssets = planning.totalAssets;
  const targetValue = planning.targetValue;

  // Calcula quantos anos faltam para o targetDate
  const yearsRemaining =
    targetDate.getFullYear() +
    (targetDate.getMonth() + 1) / 12 -
    (now.getFullYear() + (now.getMonth() + 1) / 12);

  if (yearsRemaining <= 0) {
    return {
      message: "O prazo para a meta já passou ou é hoje.",
      suggestion: null,
    };
  }

  // Calcular impacto anual líquido dos movimentos
  let annualMovementsImpact = 0;

  for (const mv of movements) {
    const sign = mv.type === "positive" ? 1 : -1;
    switch (mv.frequency) {
      case "one_time":
        if (mv.date >= now && mv.date <= targetDate) {
          annualMovementsImpact += (sign * mv.value) / yearsRemaining;
        }
        break;
      case "monthly":
        annualMovementsImpact += sign * mv.value * 12;
        break;
      case "yearly":
        annualMovementsImpact += sign * mv.value;
        break;
    }
  }

  // Projeção dos ativos ajustada
  const r = annualReturnRate;
  const n = yearsRemaining;
  const PV = totalAssets;
  const FV = targetValue;

  const assetsProjected =
    PV * Math.pow(1 + r, n) +
    annualMovementsImpact * ((Math.pow(1 + r, n) - 1) / r);

  if (assetsProjected >= FV) {
    return {
      message:
        "Os ativos atuais e os movimentos financeiros provavelmente alcançarão a meta. Mantenha seus investimentos ou revise seus objetivos.",
      suggestion: null,
      expectedAssets: Number(assetsProjected.toFixed(2)),
    };
  }

  // Calcula aporte anual necessário
  const denominator = (Math.pow(1 + r, n) - 1) / r;
  const numerator =
    FV - PV * Math.pow(1 + r, n) - annualMovementsImpact * denominator;
  const annualContribution = numerator / denominator;

  return {
    message: "Para atingir a meta, considere os aportes anuais abaixo:",
    suggestion: {
      yearsRemaining: Number(yearsRemaining.toFixed(2)),
      annualContribution: Number(annualContribution.toFixed(2)),
      monthsRemaining: Number((yearsRemaining * 12).toFixed(2)),
      installments: `${Math.ceil(yearsRemaining * 12)} parcelas mensais de R$ ${(
        annualContribution / 12
      ).toFixed(2)}`,
      expectedAssetsIfNoAdditionalContribution: Number(
        assetsProjected.toFixed(2)
      ),
      targetValue: FV,
    },
  };
}
