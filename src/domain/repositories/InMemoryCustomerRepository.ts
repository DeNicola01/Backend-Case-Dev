// src/domain/repositories/PrismaCustomerRepository.ts
import { Customer } from '../entities/Customer';
import { CustomerRepository } from './CustomerRepository';
import { prisma } from '../../shared/prisma';

export class PrismaCustomerRepository implements CustomerRepository {
  async create(customer: Customer): Promise<Customer> {
    const created = await prisma.customer.create({ data: customer });
    return created as Customer;
  }

  async findById(id: string): Promise<Customer | null> {
    return (await prisma.customer.findUnique({ where: { id } })) as Customer | null;
  }

  async findAll(): Promise<Customer[]> {
    return (await prisma.customer.findMany()) as Customer[];
  }

  async update(customer: Customer): Promise<Customer> {
    return (await prisma.customer.update({
      where: { id: customer.id },
      data: customer,
    })) as Customer;
  }

  async delete(id: string): Promise<void> {
    await prisma.customer.delete({ where: { id } });
  }
}
