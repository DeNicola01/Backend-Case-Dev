import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaInsuranceRepository } from '../../domain/repositories/InsuranceRepository';
import { InsuranceService } from '../../usecases/InsuranceService';

const repo = new PrismaInsuranceRepository();
const service = new InsuranceService(repo);

export async function createInsuranceHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const body = req.body as any;
    const insurance = await service.create({
      ...body,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : undefined
    });
    return reply.code(201).send(insurance);
  } catch (err) {
    console.error(err);
    return reply.code(500).send({ message: 'Erro ao registrar seguro' });
  }
}

export async function listInsuranceHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const list = await service.list();
    return reply.send(list);
  } catch (err) {
    console.error(err);
    return reply.code(500).send({ message: 'Erro ao listar seguros' });
  }
}

export async function getInsuranceHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as any;
    const insurance = await service.getById(id);
    if (!insurance) return reply.code(404).send({ message: 'Seguro não encontrado' });
    return reply.send(insurance);
  } catch (err) {
    console.error(err);
    return reply.code(500).send({ message: 'Erro ao buscar seguro' });
  }
}

export async function updateInsuranceHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as any;
    const body = req.body as any;
    const insurance = await service.update(id, body);
    return reply.send(insurance);
  } catch (err) {
    console.error(err);
    return reply.code(500).send({ message: 'Erro ao atualizar seguro' });
  }
}

export async function deleteInsuranceHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as any;
    await service.delete(id);
    return reply.code(204).send();
  } catch (err) {
    console.error(err);
    return reply.code(500).send({ message: 'Erro ao deletar seguro' });
  }
}

export async function distributionInsuranceHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const dist = await service.distribution();
    return reply.send(dist);
  } catch (err) {
    console.error(err);
    return reply.code(500).send({ message: 'Erro ao buscar distribuição de seguros' });
  }
}
