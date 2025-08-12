import { PrismaClient, Movement } from '@prisma/client';
const prisma = new PrismaClient();

export interface MovementData {
  id?: string;
  planningId: string;
  customerId: string;  // obrigatório
  type: 'positive' | 'negative'; // Tipo do evento (aporte, resgate, etc.)
  value: number;
  frequency: 'one_time' | 'monthly' | 'yearly';
  date: Date;          // Date, não string
}



export class PrismaMovementRepository {
  async create(data: MovementData): Promise<Movement> {
    return prisma.movement.create({ data });
  }

  async findById(id: string): Promise<Movement | null> {
    return prisma.movement.findUnique({ where: { id } });
  }

  async findAllByPlanning(planningId: string): Promise<Movement[]> {
    return prisma.movement.findMany({ where: { planningId } });
  }

  async update(id: string, data: Partial<MovementData>): Promise<Movement> {
    return prisma.movement.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.movement.delete({ where: { id } });
  }
}
