import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import type { Prisma, $Enums } from '@prisma/client';

export async function createPlanning(data: {
  customerId: string;
  goalType: $Enums.GoalType;
  goalName: string;
  targetValue: number;
  targetDate: string;
  portfolio: { assetClass: string; percentage: number }[];
  totalAssets: number;
  plannedAssets: number;
}) {
  return prisma.planning.create({
    data: {
      customerId: data.customerId,
      goalName: data.goalName,
      goalType: data.goalType,
      targetValue: data.targetValue,
      targetDate: new Date(data.targetDate),
      portfolioJson: data.portfolio,
      totalAssets: data.totalAssets,
      plannedAssets: data.plannedAssets,
    },
  });
}

export async function listPlannings() {
  const plannings = await prisma.planning.findMany({
    include: { customer: true },
  });

  return plannings.map((p) => {
    const alignmentPercentage = (p.totalAssets / p.targetValue) * 100;
    let alignmentCategory = 'vermelho';

    if (alignmentPercentage > 90) alignmentCategory = 'verde';
    else if (alignmentPercentage > 70) alignmentCategory = 'amarelo-claro';
    else if (alignmentPercentage > 50) alignmentCategory = 'amarelo-escuro';

    return {
      ...p,
      alignmentPercentage,
      alignmentCategory,
    };
  });
}
