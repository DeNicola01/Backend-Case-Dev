import { prisma } from '../../shared/prisma';
import { Insurance } from '@prisma/client';

export interface InsuranceData {
  id?: string;
  customerId: string;
  type: 'vida' | 'invalidez';
  value: number;
  startDate: Date;
  endDate?: Date;
}

export class PrismaInsuranceRepository {
  async create(data: InsuranceData): Promise<Insurance> {
    return prisma.insurance.create({ data });
  }

  async list(): Promise<Insurance[]> {
    return prisma.insurance.findMany();
  }

  async getById(id: string): Promise<Insurance | null> {
    return prisma.insurance.findUnique({ where: { id } });
  }

  async update(id: string, data: Partial<InsuranceData>): Promise<Insurance> {
    return prisma.insurance.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.insurance.delete({ where: { id } });
  }

  async distributionByType(): Promise<{ type: string; total: number }[]> {
    return prisma.insurance.groupBy({
      by: ['type'],
      _sum: { value: true },
    }).then(res =>
      res.map(r => ({
        type: r.type,
        total: r._sum.value ?? 0,
      }))
    );
  }
}
