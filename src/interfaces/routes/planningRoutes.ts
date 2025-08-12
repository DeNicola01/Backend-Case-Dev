import { FastifyInstance } from 'fastify';
import { createPlanningHandler, getPlanningSuggestionHandler } from '../controllers/PlanningController';

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

  app.get(
    '/suggestion/:customerId',
    {
      schema: {
        tags: ['Planning'],
        summary: 'Obter sugestões para alcançar a meta do planejamento do cliente',
        params: {
          type: 'object',
          properties: {
            customerId: { type: 'string', format: 'uuid' },
          },
          required: ['customerId'],
        },
        response: {
          200: {
            description: 'Sugestões geradas com sucesso',
            type: 'object',
            properties: {
              message: { type: 'string' },
              suggestion: {
                type: ['object', 'null'],
                nullable: true,
                properties: {
                  yearsRemaining: { type: 'number' },
                  annualContribution: { type: 'number' },
                  monthsRemaining: { type: 'number' },
                  expectedAssetsIfNoAdditionalContribution: { type: 'number' },
                  installments: { type: 'string' },
                  targetValue: { type: 'number' },

                },
              },
            },
          },
          404: {
            description: 'Planejamento não encontrado para o cliente',
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    getPlanningSuggestionHandler
  );
}
