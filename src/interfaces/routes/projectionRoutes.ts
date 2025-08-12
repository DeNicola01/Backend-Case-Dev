// src/interfaces/routes/projectionRoutes.ts
import { FastifyInstance } from 'fastify';

export default async function projectionRoutes(app: FastifyInstance) {
  app.get('/', {
    schema: {
      tags: ['Projection'],
      summary: 'Gera projeção patrimonial até 2060 usando taxa real composta',
      querystring: {
        type: 'object',
        required: ['initialAssets'],
        properties: {
          initialAssets: { type: 'number', description: 'Patrimônio inicial. Ex: 500000' },
          rate: { type: 'number', description: 'Taxa real a.a. em % (default 4%). Ex: 4' }
        }
      },
      response: {
        200: {
          description: 'Projeção ano a ano até 2060',
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
    const { initialAssets, rate = 4 } = request.query as { initialAssets: number; rate?: number };

    const currentYear = new Date().getFullYear();
    const endYear = 2060;
    const projection = [];

    let patrimonio = initialAssets;
    const growthRate = 1 + rate / 100;

    for (let year = currentYear; year <= endYear; year++) {
      projection.push({
        year,
        assets: Number(patrimonio.toFixed(2))
      });
      patrimonio *= growthRate;
    }

    return projection;
  });
}
