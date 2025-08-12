import { PrismaPlanningRepository } from '../../domain/repositories/PlanningRepository';
import { FastifyRequest, FastifyReply } from 'fastify';
import { generateSuggestions } from '../../usecases/FinancialSuggestionService';

const repo = new PrismaPlanningRepository();

function getCategory(alignmentPercent: number): string {
  if (alignmentPercent > 90) return 'verde';
  if (alignmentPercent > 70) return 'amarelo-claro';
  if (alignmentPercent > 50) return 'amarelo-escuro';
  return 'vermelho';
}

interface CreatePlanningBody {
  customerId: string;
  goalType: 'retirement' | 'short_term' | 'medium_term';
  goalName: string;
  targetValue: number;
  targetDate: string;
  totalAssets: number;
  plannedAssets: number;
}

export async function createPlanningHandler(
  request: FastifyRequest<{ Body: CreatePlanningBody }>,
  reply: FastifyReply
) {
  const { customerId, goalType, goalName, targetValue, targetDate, totalAssets, plannedAssets } = request.body;

  const alignmentPercent = (totalAssets / targetValue) * 100;
  const category = getCategory(alignmentPercent);

  const portfolioJson = {
    alignmentPercent,
    category,
  };

  try {
    const planning = await repo.create({
      customerId,
      goalType,
      goalName,
      targetValue,
      targetDate: new Date(targetDate),
      totalAssets,
      portfolioJson,
      plannedAssets
    });

    return reply.code(201).send(planning);
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ message: 'Erro ao criar planejamento' });
  }
}

export async function getPlanningSuggestionHandler(
  request: FastifyRequest<{ Params: { customerId: string } }>,
  reply: FastifyReply
) {
  const { customerId } = request.params;

  try {
    const planning = await repo.findFirstByCustomerId(customerId);

    if (!planning) {
      return reply.status(404).send({ message: "Planejamento não encontrado para este cliente" });
    }

    // Se precisar buscar movements para sugestões, pode incluir aqui:
    // const movements = await repo.findMovementsByPlanningId(planning.id);
    // const suggestion = generateSuggestions(planning, movements);

    const suggestion = await generateSuggestions(planning.id);

    return reply.send(suggestion);
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ message: "Erro ao buscar sugestão" });
  }
}

export async function updatePlanningTotalAssetsHandler(
  request: FastifyRequest<{ Params: { planningId: string }; Body: { totalAssets: number } }>,
  reply: FastifyReply
) {
  const { planningId } = request.params;
  const { totalAssets } = request.body;

  try {
    const updated = await repo.updateTotalAssets(planningId, totalAssets);

    if (!updated) {
      return reply.status(404).send({ message: 'Planejamento não encontrado' });
    }

    return reply.status(200).send(updated);
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ message: 'Erro ao atualizar totalAssets' });
  }
}
