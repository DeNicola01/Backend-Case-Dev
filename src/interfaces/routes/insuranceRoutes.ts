import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  createInsuranceHandler,
  listInsuranceHandler,
  getInsuranceHandler,
  updateInsuranceHandler,
  deleteInsuranceHandler,
  distributionInsuranceHandler,
} from "../controllers/InsuranceController";

function asyncHandler(
  fn: (request: FastifyRequest, reply: FastifyReply) => Promise<any>
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await fn(request, reply);
    } catch (error) {
      console.error("Erro na rota:", error);
      reply.status(500).send({ error: error instanceof Error ? error.message : "Erro interno" });
    }
  };
}

export default async function insuranceRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      schema: {
        tags: ["Insurance"],
        summary: "Cria um seguro",
        body: {
          type: "object",
          required: ["customerId", "type", "value", "startDate"],
          properties: {
            customerId: { type: "string", description: "ID do cliente" },
            type: {
              type: "string",
              description: 'Tipo do seguro ("vida" ou "invalidez")',
              enum: ["vida", "invalidez"],
            },
            value: { type: "number", description: "Valor do seguro" },
            startDate: {
              type: "string",
              format: "date-time",
              description: "Data de início do seguro",
            },
            endDate: {
              type: "string",
              format: "date-time",
              description: "Data de término do seguro (opcional)",
              nullable: true,
            },
          },
        },
      },
    },
    asyncHandler(createInsuranceHandler)
  );

  app.get(
    "/",
    {
      schema: {
        tags: ["Insurance"],
        summary: "Lista todos os seguros",
      },
    },
    asyncHandler(listInsuranceHandler)
  );

  app.get(
    "/distribution",
    {
      schema: {
        tags: ["Insurance"],
        summary: "Distribuição dos seguros",
      },
    },
    asyncHandler(distributionInsuranceHandler)
  );

  app.get(
    "/:id",
    {
      schema: {
        tags: ["Insurance"],
        summary: "Obtém seguro por ID",
        params: { type: "object", properties: { id: { type: "string" } } },
      },
    },
    asyncHandler(getInsuranceHandler)
  );

  app.put(
    "/:id",
    {
      schema: {
        tags: ["Insurance"],
        summary: "Atualiza seguro",
        params: { type: "object", properties: { id: { type: "string" } } },
        body: {
          type: "object",
          properties: {
            customerId: { type: "string", description: "ID do cliente" },
            type: {
              type: "string",
              description: 'Tipo do seguro ("vida" ou "invalidez")',
              enum: ["vida", "invalidez"],
            },
            value: { type: "number", description: "Valor do seguro" },
            startDate: {
              type: "string",
              format: "date-time",
              description: "Data de início do seguro",
            },
            endDate: {
              type: "string",
              format: "date-time",
              description: "Data de término do seguro (opcional)",
              nullable: true,
            },
          },
        },
      },
    },
    asyncHandler(updateInsuranceHandler)
  );

  app.delete(
    "/:id",
    {
      schema: {
        tags: ["Insurance"],
        summary: "Remove seguro",
        params: { type: "object", properties: { id: { type: "string" } } },
      },
    },
    asyncHandler(deleteInsuranceHandler)
  );
}
