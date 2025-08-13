import { prisma } from "../../shared/prisma"; // sua instância Prisma
import { buildFastify } from "../../main/server";
import { beforeAll, afterAll, describe, test, expect } from "@jest/globals";
import type { FastifyInstance } from "fastify";

describe("Projection Routes", () => {
  let app: FastifyInstance;
  let createdCustomerId: string;

  beforeAll(async () => {
    app = buildFastify();
    await app.ready();

    // Cria cliente e planejamento para testar
    const customer = await prisma.customer.create({
      data: {
        name: "Cliente Teste Projection",
        email: `client-projection${Date.now()}@teste.com`,
        age: 40,
        isActive: true,
        familyProfile: "single",
      },
    });
    createdCustomerId = customer.id;

    await prisma.planning.create({
      data: {
        customerId: createdCustomerId,
        targetValue: 100000,
        targetDate: new Date(new Date().getFullYear() + 10, 11, 31),
        totalAssets: 100000,
        plannedAssets: 50000,
        portfolioJson: {},
        goalName: "Aposentadoria",
        goalType: "retirement",
      },
    });
  });

  afterAll(async () => {
    // Apaga dados de teste para limpar DB (opcional)
    await prisma.planning.deleteMany({ where: { customerId: createdCustomerId } });
    await prisma.customer.delete({ where: { id: createdCustomerId } });

    await app.close();
    await prisma.$disconnect();
  });

  test("GET / - gera projeção patrimonial padrão com taxa 4%", async () => {
    const response = await app.inject({
      method: "GET",
      url: `/projection?customerId=${createdCustomerId}`,
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.payload);

    const currentYear = new Date().getFullYear();
    const lastYear = 2060;

    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(lastYear - currentYear + 1);

    expect(body[0]).toHaveProperty("year", currentYear);

    // Confere o último ano
    expect(body[body.length - 1]).toHaveProperty("year", lastYear);
  });

  test("GET / - gera projeção patrimonial com taxa personalizada", async () => {
    const rate = 5;

    const response = await app.inject({
      method: "GET",
      url: `/projection?customerId=${createdCustomerId}&rate=${rate}`,
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.payload);
    const currentYear = new Date().getFullYear();

    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(2060 - currentYear + 1);

    expect(body[0]).toHaveProperty("year", currentYear);
  });

  test("GET / - retorna erro se customerId não informado", async () => {
    const response = await app.inject({
      method: "GET",
      url: `/projection`,
    });

    expect(response.statusCode).toBe(400);
  });
});
