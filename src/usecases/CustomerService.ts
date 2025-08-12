
import { Customer } from '../domain/entities/Customer';
import { CustomerRepository } from '../domain/repositories/CustomerRepository';

export class CustomerService {
  constructor(private customerRepo: CustomerRepository) {}

  create(customer: Customer) {
    return this.customerRepo.create(customer);
  }

  getById(id: string) {
    return this.customerRepo.findById(id);
  }

  getAll() {
    return this.customerRepo.findAll();
  }

  update(customer: Customer) {
    return this.customerRepo.update(customer);
  }

  delete(id: string) {
    return this.customerRepo.delete(id);
  }
}
