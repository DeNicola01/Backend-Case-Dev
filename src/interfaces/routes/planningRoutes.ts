import { FastifyInstance } from 'fastify';
import { createPlanningHandler } from '../controllers/PlanningController';

const planningSchema = {
  type: 'object',
  required: [
    'customerId',
    'goalType',
    'goalName',
    'targetValue',
    'targetDate',
    'portfolioJson',
    'totalAssets',
    'plannedAssets'
  ],
  properties: {
    customerId: { type: 'string', format: 'uuid' },
    goalName: { type: 'string' },
    goalType: { type: 'string', enum: ['retirement', 'short_term', 'medium_term'] },
    targetValue: { type: 'number' },
    targetDate: { type: 'string', format: 'date-time' },
    portfolioJson: { type: 'object' },
    totalAssets: { type: 'number' },
    plannedAssets: { type: 'number' }
  }
};

export default async function planningRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      schema: {
        tags: ['Planning'],
        summary: 'Registrar um planejamento financeiro',
        body: planningSchema,
        response: {
          201: {
            description: 'Planejamento criado com sucesso',
            ...planningSchema,
          },
        },
      },
    },
    createPlanningHandler
  );

  app.get(
    '/',
    {
      schema: {
        tags: ['Planning'],
        summary: 'Listar todos os planejamentos',
        response: {
          200: {
            type: 'array',
            items: planningSchema,
          },
        },
      },
    },
    async function listPlanningsHandlerPlaceholder(request, reply) {
      reply.status(501).send({ message: 'Not implemented' });
    }
  );
}
