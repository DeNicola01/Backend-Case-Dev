import { prisma } from "../../shared/prisma";
import { buildFastify } from "../../main/server";
import { beforeAll, afterAll, describe, test, expect } from "@jest/globals";
import type { FastifyInstance } from "fastify";

describe("Movement Routes", () => {
  let app: FastifyInstance;
  let createdMovementId: string;
  let createdCustomerId: string;
  let createdPlanningId: string;

  beforeAll(async () => {
    app = buildFastify();
    await app.ready();

    // Criar cliente para associar às movimentações
    const customer = await prisma.customer.create({
      data: {
        name: "Cliente Teste Movement",
        email: `client-movement${Date.now()}@teste.com`, // email único
        age: 30,
        isActive: true,
        familyProfile: "single",
      },
    });
    createdCustomerId = customer.id;

    // Criar planejamento para associar às movimentações
    const planning = await prisma.planning.create({
      data: {
        customerId: createdCustomerId,
        targetValue: 100000,
        targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        totalAssets: 50000,
        plannedAssets: 20000,
        goalName: "Aposentadoria",
        goalType: "retirement",
      },
    });
    createdPlanningId = planning.id;
  });

  afterAll(async () => {
    // Apagar movimentações criadas
    if (createdMovementId) {
      await prisma.movement.deleteMany({ where: { id: createdMovementId } });
    }
    // Apagar planejamento e cliente criados
    if (createdPlanningId) {
      await prisma.planning.deleteMany({ where: { id: createdPlanningId } });
    }
    if (createdCustomerId) {
      await prisma.customer.deleteMany({ where: { id: createdCustomerId } });
    }

    await prisma.$disconnect();
    await app.close();
  });

  test("POST / - cria uma movimentação", async () => {
    const mockMovement = {
      planningId: createdPlanningId,
      customerId: createdCustomerId,
      type: "negative", // Verifique se "aporte" é válido no enum do Prisma, caso contrário ajuste
      value: 1000,
      frequency: "one_time",
      date: new Date().toISOString(),
    };

    const response = await app.inject({
      method: "POST",
      url: "/movements",
      payload: mockMovement,
    });

    expect(response.statusCode).toBe(201);

    const body = JSON.parse(response.payload);
    expect(body).toMatchObject({
      planningId: mockMovement.planningId,
      customerId: mockMovement.customerId,
      type: mockMovement.type,
      value: mockMovement.value,
      frequency: mockMovement.frequency,
    });
    expect(body).toHaveProperty("id");

    createdMovementId = body.id;
  });

  test("GET / - lista todas movimentações", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/movements",
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(Array.isArray(body)).toBe(true);
  });

  test("GET /:id - obtém movimentação por id", async () => {
    const response = await app.inject({
      method: "GET",
      url: `/movements/${createdMovementId}`,
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.id).toBe(createdMovementId);
  });

  test("PUT /:id - atualiza movimentação", async () => {
    const updatePayload = {
      type: "positive", // Verifique se "resgate" é válido no enum do Prisma
      value: 500,
      frequency: "monthly",
      date: new Date().toISOString(),
    };

    const response = await app.inject({
      method: "PUT",
      url: `/movements/${createdMovementId}`,
      payload: updatePayload,
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.type).toBe(updatePayload.type);
    expect(body.value).toBe(updatePayload.value);
    expect(body.frequency).toBe(updatePayload.frequency);
  });

  test("DELETE /:id - remove movimentação", async () => {
    const response = await app.inject({
      method: "DELETE",
      url: `/movements/${createdMovementId}`,
    });

    expect(response.statusCode).toBe(204);
  });

  test("GET /:id - movimentação deletada retorna 404", async () => {
    const response = await app.inject({
      method: "GET",
      url: `/movements/${createdMovementId}`,
    });

    expect(response.statusCode).toBe(404);
  });
});
