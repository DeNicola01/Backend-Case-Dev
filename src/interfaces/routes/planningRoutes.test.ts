import { prisma } from "../../shared/prisma";
import { buildFastify } from "../../main/server";
import { beforeAll, afterAll, describe, test, expect } from "@jest/globals";
import type { FastifyInstance } from "fastify";

describe("Planning Routes", () => {
  let app: FastifyInstance;
  let createdPlanningId: string;
  let createdCustomerId: string;

  beforeAll(async () => {
    app = buildFastify();
    await app.ready();

    // Criar cliente para associar ao planejamento
    const customer = await prisma.customer.create({
      data: {
        name: "Cliente Teste",
        email: `client${Date.now()}@teste.com`,
        age: 30,
        isActive: true,
        familyProfile: "single",
      },
    });
    createdCustomerId = customer.id;

    // Criar planejamento para garantir que existe para update/suggestion
    const planning = await prisma.planning.create({
      data: {
        customerId: createdCustomerId,
        goalName: "Aposentadoria",
        goalType: "retirement",
        targetValue: 100000,
        targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 ano no futuro
        portfolioJson: {},
        totalAssets: 50000,
        plannedAssets: 20000,
      },
    });
    createdPlanningId = planning.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  test("POST / - cria um planejamento", async () => {
    const mockPlanning = {
      customerId: createdCustomerId,
      goalName: "Investimento",
      goalType: "medium_term",
      targetValue: 200000,
      targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 2).toISOString(),
      portfolioJson: {},
      totalAssets: 100000,
      plannedAssets: 50000,
    };

    const response = await app.inject({
      method: "POST",
      url: "/plannings",
      payload: mockPlanning,
    });

    expect(response.statusCode).toBe(201);

    const body = JSON.parse(response.payload);
    expect(body.customerId).toBe(mockPlanning.customerId);
    expect(body.goalName).toBe(mockPlanning.goalName);
    expect(body.goalType).toBe(mockPlanning.goalType);
    expect(body.targetValue).toBe(mockPlanning.targetValue);
    expect(new Date(body.targetDate).toISOString()).toBe(mockPlanning.targetDate);
    expect(body.portfolioJson).toMatchObject(mockPlanning.portfolioJson);
    expect(body.totalAssets).toBe(mockPlanning.totalAssets);
    expect(body.plannedAssets).toBe(mockPlanning.plannedAssets);
  });

  test("PUT /:planningId/totalAssets - atualiza totalAssets do planejamento", async () => {
    const newTotalAssets = 123456.78;

    const response = await app.inject({
      method: "PUT",
      url: `/plannings/${createdPlanningId}/totalAssets`,
      payload: { totalAssets: newTotalAssets },
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.payload);
    expect(body).toHaveProperty("id", createdPlanningId);
    expect(body).toHaveProperty("totalAssets", newTotalAssets);
    expect(new Date(body.updatedAt).toString()).not.toBe("Invalid Date");
  });

  test("PUT /:planningId/totalAssets - retorna 500 se planejamento não encontrado", async () => {
    const fakePlanningId = "00000000-0000-0000-0000-000000000000";

    const response = await app.inject({
      method: "PUT",
      url: `/plannings/${fakePlanningId}/totalAssets`,
      payload: { totalAssets: 1000 },
    });

    expect(response.statusCode).toBe(500);

    const body = JSON.parse(response.payload);
  });

  test("PUT /:planningId/totalAssets - retorna 400 se body inválido", async () => {
    const response = await app.inject({
      method: "PUT",
      url: `/plannings/${createdPlanningId}/totalAssets`,
      payload: { wrongField: 1000 }, // campo inválido
    });

    expect(response.statusCode).toBe(400);
  });
});
