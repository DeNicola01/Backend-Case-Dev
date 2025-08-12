import { FastifyInstance } from "fastify";
import {
  createMovementHandler,
  listMovementsHandler,
  getMovementHandler,
  updateMovementHandler,
  deleteMovementHandler,
} from "../controllers/MovementController";

export default async function movementRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      schema: {
        tags: ["Movements"],
        summary: "Cria uma movimentação",
        body: {
          type: "object",
          required: [
            "type",
            "value",
            "frequency",
            "customerId",
            "planningId",
            "date",
          ],
          properties: {
            planningId: { type: "string", description: "ID do planejamento" },
            customerId: { type: "string", description: "ID do cliente" },
            type: {
              type: "string",
              enum: ["positive", "negative"],
              description: "Tipo do evento (aporte, resgate, etc.)",
            },
            value: { type: "number", description: "Valor da movimentação" },
            frequency: {
              type: "string",
              enum: ["one_time", "monthly", "yearly"],
            },
            date: {
              type: "string",
              format: "date-time",
              description: "Data da movimentação",
            },
          },
        },
      },
    },
    createMovementHandler
  );

  app.get(
    "/",
    {
      schema: {
        tags: ["Movements"],
        summary: "Lista todas as movimentações",
      },
    },
    listMovementsHandler
  );

  app.get(
    "/:id",
    {
      schema: {
        tags: ["Movements"],
        summary: "Obtém movimentação por ID",
        params: { type: "object", properties: { id: { type: "string" } }, required: ["id"] }
      },
    },
    getMovementHandler
  );

  app.put(
    "/:id",
    {
      schema: {
        tags: ["Movements"],
        summary: "Atualiza movimentação",
        body: {
          type: "object",
          required: [
            "type",
            "value",
            "frequency",
            "date",
          ],
          properties: {
            type: {
              type: "string",
              description: "Tipo do evento (aporte, resgate, etc.)",
            },
            value: { type: "number", description: "Valor da movimentação" },
            frequency: {
              type: "string",
              enum: ["one_time", "monthly", "yearly"],
            },
            date: {
              type: "string",
              format: "date-time",
              description: "Data da movimentação",
            },
          },
        },
        params: { type: "object", properties: { id: { type: "string" } } },
      },
    },
    updateMovementHandler
  );

  app.delete(
    "/:id",
    {
      schema: {
        tags: ["Movements"],
        summary: "Remove movimentação",
        params: { type: "object", properties: { id: { type: "string" } } },
      },
    },
    deleteMovementHandler
  );
}
