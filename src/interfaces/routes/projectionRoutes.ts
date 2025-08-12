import { FastifyInstance } from 'fastify';
import { PrismaPlanningRepository } from '../../domain/repositories/PlanningRepository';

const repo = new PrismaPlanningRepository();

export default async function projectionRoutes(app: FastifyInstance) {
  app.get('/', {
    schema: {
      tags: ['Projection'],
      summary: 'Gera projeção patrimonial até um ano definido (default 2060) usando taxa real composta, descontando eventos financeiros',
      querystring: {
        type: 'object',
        required: ['customerId'],
        properties: {
          customerId: { type: 'string', format: 'uuid', description: 'ID do cliente para buscar planejamento' },
          rate: { type: 'number', description: 'Taxa real a.a. em % (default 4%). Ex: 4' },
          endYear: { type: 'number', description: 'Ano final para projeção (default 2060)', minimum: new Date().getFullYear() }
        }
      },
      response: {
        200: {
          description: 'Projeção ano a ano até o ano especificado',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              year: { type: 'number' },
              assets: { type: 'number' }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { customerId, rate = 4, endYear = 2060 } = request.query as { customerId: string; rate?: number; endYear?: number };

    const currentYear = new Date().getFullYear();
    if (endYear < currentYear) {
      return reply.status(400).send({ message: `O ano final deve ser maior ou igual a ${currentYear}` });
    }

    // Busca planejamento do cliente
    const planning = await repo.findFirstByCustomerId(customerId);
    if (!planning) {
      return reply.status(404).send({ message: 'Planejamento não encontrado para este cliente' });
    }

    // Busca eventos (movements) associados ao planejamento
    const movements = await repo.findMovementsByPlanningId(planning.id);

    const initialAssets = planning.totalAssets;
    const startDate = new Date();
    const endDate = new Date(endYear, 11, 31);

    // Taxa mensal (convertendo taxa anual para mensal)
    const monthlyRate = Math.pow(1 + rate / 100, 1 / 12);

    // Inicializa patrimônio mensal
    let patrimonio = initialAssets;

    // Cria mapa ano => valor no final do ano
    const yearlyProjection: { [year: number]: number } = {};

    // Simula mês a mês até dezembro do ano final
    let currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

    while (currentDate <= endDate) {
      // Aplica crescimento mensal
      patrimonio *= monthlyRate;

      // Aplica eventos no mês atual
      for (const mv of movements) {
        if (mv.frequency === 'one_time') {
          // Evento único, ocorre em data exata
          const eventDate = new Date(mv.date);
          if (eventDate.getFullYear() === currentDate.getFullYear() &&
              eventDate.getMonth() === currentDate.getMonth()) {
            patrimonio += mv.value; // pode ser positivo ou negativo
          }
        } else if (mv.frequency === 'monthly') {
          // Evento mensal, subtrai todo mês
          patrimonio += mv.value;
        } else if (mv.frequency === 'yearly') {
          // Evento anual, ocorre no mesmo mês do planejamento? Vou assumir no mês do planejamento
          if (currentDate.getMonth() === new Date(planning.targetDate).getMonth()) {
            patrimonio += mv.value;
          }
        }
      }

      // Se mês é dezembro, salva o patrimônio acumulado daquele ano
      if (currentDate.getMonth() === 11) {
        yearlyProjection[currentDate.getFullYear()] = patrimonio;
      }

      // Próximo mês
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    }

    // Transforma resultado em array
    const projection = [];
    for (let year = startDate.getFullYear(); year <= endYear; year++) {
      projection.push({
        year,
        assets: Number((yearlyProjection[year] ?? patrimonio).toFixed(2)),
      });
    }

    return projection;
  });
}
