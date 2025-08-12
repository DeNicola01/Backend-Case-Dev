// src/domain/repositories/PlanningRepository.ts
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
    return prisma.planning.create({ data });
  }

  async findAll() {
    return prisma.planning.findMany();
  }

  async findById(id: string) {
    return prisma.planning.findUnique({
      where: { id },
    });
  }

  async findFirstByCustomerId(customerId: string) {
    return prisma.planning.findFirst({
      where: { customerId },
      orderBy: { targetDate: "asc" },
    });
  }

  async findMovementsByPlanningId(planningId: string) {
    return prisma.movement.findMany({
      where: { planningId },
    });
  }

  async updateTotalAssets(planningId: string, totalAssets: number) {
    return await prisma.planning.update({
      where: { id: planningId },
      data: {
        totalAssets,
      },
    });
  }
}
