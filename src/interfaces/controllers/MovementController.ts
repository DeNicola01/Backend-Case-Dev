import { FastifyRequest, FastifyReply } from 'fastify';
import { MovementService } from '../../usecases/MovementService';
import { PrismaMovementRepository } from '../../domain/repositories/movementRepository';

const repo = new PrismaMovementRepository();
const service = new MovementService(repo);

export async function createMovementHandler(request: FastifyRequest, reply: FastifyReply) {
  try {

    const body = request.body as {
      planningId: string;
      customerId: string;
      type: string;
      value: number;
      frequency: 'one_time' | 'monthly' | 'yearly';
      date: string;
    };

    const payload = {
      planningId: body.planningId,
      customerId: body.customerId,
      type: body.type,
      value: body.value,
      frequency: body.frequency,
      date: new Date(body.date)
    };


    const movement = await service.create(payload);

    return reply.code(201).send(movement);

  } catch (err: any) {
    console.error('❌ [CREATE MOVEMENT] Erro ao criar movimentação:');
    console.error('Mensagem:', err.message);
    console.error('Stack:', err.stack);
    console.error('Detalhes completos do erro:', err);

    return reply.code(500).send({ message: 'Erro ao criar movimentação', error: err.message });
  }
}

export async function listMovementsHandler(request: FastifyRequest, reply: FastifyReply) {
  try {

    const planningId = (request.query as any).planningId;
    const movements = await service.listByPlanning(planningId);

    return reply.code(200).send(movements);

  } catch (err: any) {
    console.error('❌ [LIST MOVEMENTS] Erro:', err.message);
    console.error(err.stack);
    return reply.code(500).send({ message: 'Erro ao buscar movimentações', error: err.message });
  }
}

export async function getMovementHandler(request: FastifyRequest, reply: FastifyReply) {
  try {

    const id = (request.params as any).id;
    const movement = await service.getById(id);

    if (!movement) {
      console.warn(`⚠ [GET MOVEMENT] Nenhum movimento encontrado com ID: ${id}`);
      return reply.code(404).send({ message: 'Movimentação não encontrada' });
    }

    return reply.send(movement);

  } catch (err: any) {
    console.error('❌ [GET MOVEMENT] Erro:', err.message);
    console.error(err.stack);
    return reply.code(500).send({ message: 'Erro ao buscar movimentação', error: err.message });
  }
}

export async function updateMovementHandler(request: FastifyRequest, reply: FastifyReply) {
  try {

    const id = (request.params as any).id;
    const body = request.body as Partial<{
      type: string;
      value: number;
      frequency: 'one_time' | 'monthly' | 'yearly';
      date: string;
    }>;

    const updateData = {
      ...body,
      date: body.date ? new Date(body.date) : undefined
    };


    const movement = await service.update(id, updateData);

    return reply.send(movement);

  } catch (err: any) {
    console.error('❌ [UPDATE MOVEMENT] Erro:', err.message);
    console.error(err.stack);
    return reply.code(500).send({ message: 'Erro ao atualizar movimentação', error: err.message });
  }
}

export async function deleteMovementHandler(request: FastifyRequest, reply: FastifyReply) {
  try {

    const id = (request.params as any).id;
    await service.delete(id);

    return reply.code(204).send();

  } catch (err: any) {
    console.error('❌ [DELETE MOVEMENT] Erro:', err.message);
    console.error(err.stack);
    return reply.code(500).send({ message: 'Erro ao deletar movimentação', error: err.message });
  }
}
