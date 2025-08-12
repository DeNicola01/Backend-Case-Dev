import { prisma } from "../../shared/prisma";
import { buildFastify } from "../../main/server";
import { beforeAll, afterAll, describe, test, expect } from "@jest/globals";
import type { FastifyInstance } from "fastify";

describe("Customer Routes", () => {
  let app: FastifyInstance;
  let createdCustomerId: string;

  beforeAll(async () => {
    app = buildFastify();
    await app.ready();

    // Se quiser já criar um cliente antes dos testes (opcional)
    // const customer = await prisma.customer.create({
    //   data: {
    //     name: "Cliente Inicial",
    //     email: `initclient${Date.now()}@teste.com`,
    //     age: 35,
    //     isActive: true,
    //     familyProfile: "single",
    //   },
    // });
    // createdCustomerId = customer.id;
  });

  afterAll(async () => {
    // Apagar clientes criados nos testes
    await prisma.$disconnect();

    await app.close();
  });

  test("should create a new customer", async () => {
    const mockCustomer = {
      name: "Cliente Teste",
      email: `client${Date.now()}@teste.com`,
      age: 30,
      isActive: true,
      familyProfile: "single",
    };

    const response = await app.inject({
      method: "POST",
      url: "/customers",
      payload: mockCustomer,
    });

    expect(response.statusCode).toBe(201);

    const body = JSON.parse(response.payload);
    expect(body).toHaveProperty("id");
    expect(body.name).toBe(mockCustomer.name);

    createdCustomerId = body.id;
  });

  test("should list all customers", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/customers",
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(Array.isArray(body)).toBe(true);
  });

  test("should get customer by id", async () => {
    const response = await app.inject({
      method: "GET",
      url: `/customers/${createdCustomerId}`,
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.id).toBe(createdCustomerId);
  });

  test("should update a customer", async () => {
    // Criar um cliente só para este teste
    const customer = await prisma.customer.create({
      data: {
        name: "Cliente Original",
        email: `original${Date.now()}@teste.com`,
        age: 25,
        isActive: true,
        familyProfile: "single",
      },
    });

    const updatePayload = {
      name: "Cliente Atualizado",
      age: 40,
    };

    const response = await app.inject({
      method: "PUT",
      url: `/customers/${customer.id}`,
      payload: updatePayload,
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.payload);
    expect(body.name).toBe(updatePayload.name);
    expect(body.age).toBe(updatePayload.age);
  });

  test("should delete a customer", async () => {
    const response = await app.inject({
      method: "DELETE",
      url: `/customers/${createdCustomerId}`,
    });

    expect(response.statusCode).toBe(204);
  });

  test("should return 404 for deleted customer", async () => {
    const response = await app.inject({
      method: "GET",
      url: `/customers/${createdCustomerId}`,
    });

    expect(response.statusCode).toBe(404);
  });
});
