import { PlanningRepository } from '../../domain/repositories/PlanningRepository';
import { Planning } from '../../domain/entities/Planning';

export class InMemoryPlanningRepository implements PlanningRepository {
  private plannings: Planning[] = [];

  async create(planning: Planning): Promise<Planning> {
    this.plannings.push(planning);
    return planning;
  }

  async findById(id: string): Promise<Planning | null> {
    return this.plannings.find(p => p.id === id) || null;
  }

  async findAll(): Promise<Planning[]> {
    return this.plannings;
  }

  async findByCustomer(customerId: string): Promise<Planning[]> {
    return this.plannings.filter(p => p.customerId === customerId);
  }
}
