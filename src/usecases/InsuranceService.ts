import { PrismaInsuranceRepository, InsuranceData } from '../domain/repositories/InsuranceRepository';

export class InsuranceService {
  constructor(private repo: PrismaInsuranceRepository) {}

  create(data: InsuranceData) {
    return this.repo.create(data);
  }

  list() {
    return this.repo.list();
  }

  getById(id: string) {
    return this.repo.getById(id);
  }

  update(id: string, data: Partial<InsuranceData>) {
    return this.repo.update(id, data);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }

  distribution() {
    return this.repo.distributionByType();
  }
}
