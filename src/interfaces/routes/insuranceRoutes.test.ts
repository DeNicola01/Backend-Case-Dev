import { prisma } from "../../shared/prisma";
import { buildFastify } from "../../main/server";
import { beforeAll, afterAll, describe, test, expect } from "@jest/globals";
import type { FastifyInstance } from "fastify";

describe("Insurance Routes", () => {
  let app: FastifyInstance;
  let createdInsuranceId: string;
  let createdCustomerId: string;

  beforeAll(async () => {
    app = buildFastify();
    await app.ready();

    // Criar cliente para associar aos seguros
    const customer = await prisma.customer.create({
      data: {
        name: "Cliente Teste",
        email: `client${Date.now()}@teste.com`, // para garantir email único
        age: 30,
        isActive: true,
        familyProfile: "single",
      },
    });
    createdCustomerId = customer.id;
  });

  afterAll(async () => {
    // Apagar dados na ordem para evitar violação de FK
    await prisma.$disconnect();

    await app.close();
  });

  test("should create a new insurance", async () => {
    const mockInsurance = {
      type: "vida",
      value: 10000,
      customerId: createdCustomerId,
      startDate: "2023-08-11T12:34:56Z",
    };

    const response = await app.inject({
      method: "POST",
      url: "/insurances",
      payload: mockInsurance,
    });

    expect(response.statusCode).toBe(201);

    const body = JSON.parse(response.payload);
    expect(body).toHaveProperty("id");
    expect(body.type).toBe(mockInsurance.type);

    createdInsuranceId = body.id;
  });

  test("should list all insurances", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/insurances",
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(Array.isArray(body)).toBe(true);
  });

  test("should get insurance by id", async () => {
    const response = await app.inject({
      method: "GET",
      url: `/insurances/${createdInsuranceId}`,
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.id).toBe(createdInsuranceId);
  });

  test("should update an insurance", async () => {
    const updatePayload = {
      type: "invalidez",
      value: 20100,
    };

    const response = await app.inject({
      method: "PUT",
      url: `/insurances/${createdInsuranceId}`,
      payload: updatePayload,
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.type).toBe(updatePayload.type);
    expect(body.value).toBe(updatePayload.value);
  });

  test("should delete an insurance", async () => {
    const response = await app.inject({
      method: "DELETE",
      url: `/insurances/${createdInsuranceId}`,
    });

    expect(response.statusCode).toBe(204);
  });
});
