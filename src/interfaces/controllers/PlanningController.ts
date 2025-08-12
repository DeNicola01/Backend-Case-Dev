import { PrismaPlanningRepository } from '../../domain/repositories/PlanningRepository';
import { FastifyRequest, FastifyReply } from 'fastify';

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
      plannedAssets // or set to another appropriate value
    });

    return reply.code(201).send(planning);
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ message: 'Erro ao criar planejamento' });
  }
}
