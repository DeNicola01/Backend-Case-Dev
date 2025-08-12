import { FastifyRequest, FastifyReply } from "fastify";
import { CustomerService } from "../../usecases/CustomerService";
import { v4 as uuidv4 } from "uuid";

interface Customer {
  id: string;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
  familyProfile: string;
}

export class CustomerController {
  constructor(private customerService: CustomerService) {}

  create = async (req: FastifyRequest<{ Body: any }>, res: FastifyReply) => {
    const body = req.body as Record<string, any>;
    const customer: Customer = {
      id: uuidv4(),
      name: body.name,
      email: body.email,
      age: Number(body.age),
      isActive: Boolean(body.isActive),
      familyProfile: body.familyProfile,
    };

    const created = await this.customerService.create(customer);
    res.status(201).send(created);
  };
  getAll = async (_: FastifyRequest, res: FastifyReply) => {
    const customers = await this.customerService.getAll();
    res.send(customers);
  };

  getById = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    res: FastifyReply
  ) => {
    const customer = await this.customerService.getById(req.params.id);
    if (customer) res.send(customer);
    else res.status(404).send("Not found");
  };

  update = async (
    req: FastifyRequest<{ Params: { id: string }; Body: Partial<Customer> }>,
    res: FastifyReply
  ) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const updated = await this.customerService.update({ id, ...body } as Customer);
      res.send(updated);
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Erro ao atualizar cliente" });
    }
  };

  delete = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    res: FastifyReply
  ) => {
    await this.customerService.delete(req.params.id);
    res.status(204).send();
  };
}
