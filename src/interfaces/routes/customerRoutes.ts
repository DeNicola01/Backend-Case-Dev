import { FastifyInstance } from 'fastify';
import { CustomerController } from '../controllers/CustomerController';
import { CustomerService } from '../../usecases/CustomerService';
import { PrismaCustomerRepository } from '../../domain/repositories/InMemoryCustomerRepository';

const repo = new PrismaCustomerRepository();
const service = new CustomerService(repo);
const controller = new CustomerController(service);

const customerSchema = {
  type: 'object',
  required: ['id', 'name', 'email', 'age', 'isActive', 'familyProfile'],
  properties: {
    id: { type: 'string', format: 'uuid' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    age: { type: 'integer', minimum: 0 },
    isActive: { type: 'boolean' },
    familyProfile: { type: 'string' }
  },
};

async function customerRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/',
    {
      schema: {
        description: 'Cria novo cliente',
        tags: ['Customer'],
        body: {
          type: 'object',
          required: ['name', 'email', 'age', 'isActive', 'familyProfile'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            age: { type: 'integer', minimum: 0 },
            isActive: { type: 'boolean' },
            familyProfile: { type: 'string' }
          }
        },
        response: {
          201: customerSchema,
        },
      } as any,
    },
    controller.create
  );

  fastify.get(
    '/',
    {
      schema: {
        description: 'Lista todos os clientes',
        tags: ['Customer'],
        response: {
          200: {
            type: 'array',
            items: customerSchema,
          },
        },
      } as any,
    },
    controller.getAll
  );

  fastify.get(
    '/:id',
    {
      schema: {
        description: 'Busca cliente por ID',
        tags: ['Customer'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
        },
        response: {
          200: customerSchema,
          404: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      } as any,
    },
    controller.getById
  );

  fastify.put(
    '/:id',
    {
      schema: {
        description: 'Atualiza cliente',
        tags: ['Customer'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
        },
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            age: { type: 'integer', minimum: 0 },
            isActive: { type: 'boolean' },
            familyProfile: { type: 'string' }
          },
        },
        response: {
          200: customerSchema,
          404: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      } as any,
    },
    controller.update
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        description: 'Deleta cliente',
        tags: ['Customer'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
        },
        response: {
          204: { type: 'null' },
          404: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      } as any,
    },
    controller.delete
  );
}

export default customerRoutes;
