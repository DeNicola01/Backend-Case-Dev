
import { Customer } from '../entities/Customer';

export interface CustomerRepository {
  create(customer: Customer): Promise<Customer>;
  findById(id: string): Promise<Customer | null>;
  findAll(): Promise<Customer[]>;
  update(customer: Customer): Promise<Customer>;
  delete(id: string): Promise<void>;
}
