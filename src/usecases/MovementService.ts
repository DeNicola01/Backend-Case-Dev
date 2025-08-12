import { PrismaMovementRepository, MovementData } from '../domain/repositories/movementRepository';

export class MovementService {
  constructor(private repo: PrismaMovementRepository) {}

  async create(data: MovementData) {
    return this.repo.create(data);
  }

  async getById(id: string) {
    return this.repo.findById(id);
  }

  async listByPlanning(planningId: string) {
    return this.repo.findAllByPlanning(planningId);
  }

  async update(id: string, data: Partial<MovementData>) {
    return this.repo.update(id, data);
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }
}
