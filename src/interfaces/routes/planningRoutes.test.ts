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
  });

  afterAll(async () => {
    await prisma.$disconnect();

    await app.close();
  });

  test("POST / - cria um planejamento", async () => {
    const mockPlanning = {
      customerId: createdCustomerId,
      goalName: "Aposentadoria",
      goalType: "retirement",
      targetValue: 100000,
      targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(), // 1 ano no futuro
      portfolioJson: {},
      totalAssets: 50000,
      plannedAssets: 20000,
    };

    const response = await app.inject({
      method: "POST",
      url: "/plannings",
      payload: mockPlanning,
    });

    expect(response.statusCode).toBe(201);

    const body = JSON.parse(response.payload);

    // Verifica se os campos importantes foram criados e retornados
    expect(body.customerId).toBe(mockPlanning.customerId);
    expect(body.goalName).toBe(mockPlanning.goalName);
    expect(body.goalType).toBe(mockPlanning.goalType);
    expect(body.targetValue).toBe(mockPlanning.targetValue);
    expect(new Date(body.targetDate).toISOString()).toBe(mockPlanning.targetDate);
    expect(body.portfolioJson).toMatchObject(mockPlanning.portfolioJson);
    expect(body.totalAssets).toBe(mockPlanning.totalAssets);
    expect(body.plannedAssets).toBe(mockPlanning.plannedAssets);

    createdPlanningId = body.id;
  });
});
