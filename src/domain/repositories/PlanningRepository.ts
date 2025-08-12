import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PrismaPlanningRepository {
  async create(data: {
    customerId: string;
    goalType: "retirement" | "short_term" | "medium_term";
    goalName: string;
    targetValue: number;
    targetDate: Date;
    totalAssets: number;
    portfolioJson: any;
    plannedAssets: number;
  }) {
    return await prisma.planning.create({ data });
  }

  async findAll() {
    return await prisma.planning.findMany();
  }

  async findFirstByCustomerId(customerId: string) {
    return await prisma.planning.findFirst({
      where: { customerId },
      orderBy: { targetDate: 'asc' }, // opcional: pega o planejamento mais próximo do prazo
    });
  }

   async findMovementsByPlanningId(planningId: string) {
    return prisma.movement.findMany({
      where: { planningId }
    });
  }
}
