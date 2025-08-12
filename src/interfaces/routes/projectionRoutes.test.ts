import { buildFastify } from "../../main/server";
import { beforeAll, afterAll, describe, test, expect } from "@jest/globals";
import type { FastifyInstance } from "fastify";

describe("Projection Routes", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = buildFastify();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("GET / - gera projeção patrimonial padrão com taxa 4%", async () => {
    const initialAssets = 100000;

    const response = await app.inject({
      method: "GET",
      url: `/projection?initialAssets=${initialAssets}`,
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.payload);

    const currentYear = new Date().getFullYear();
    const lastYear = 2060;

    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(lastYear - currentYear + 1);

    // Confere o primeiro ano e valor inicial
    expect(body[0]).toHaveProperty("year", currentYear);
    expect(body[0]).toHaveProperty("assets", initialAssets);

    // Confere o último ano
    expect(body[body.length - 1]).toHaveProperty("year", lastYear);

    // Verifica se o segundo ano calculou o patrimônio com crescimento de 4%
    const growthRate = 1 + 4 / 100;
    const expectedSecondYearAssets = Number((initialAssets * growthRate).toFixed(2));
    expect(body[1].assets).toBe(expectedSecondYearAssets);
  });

  test("GET / - gera projeção patrimonial com taxa personalizada", async () => {
    const initialAssets = 500000;
    const rate = 5;

    const response = await app.inject({
      method: "GET",
      url: `/projection?initialAssets=${initialAssets}&rate=${rate}`,
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.payload);
    const currentYear = new Date().getFullYear();

    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(2060 - currentYear + 1);

    // Confere o primeiro ano e valor inicial
    expect(body[0]).toHaveProperty("year", currentYear);
    expect(body[0]).toHaveProperty("assets", initialAssets);

    // Verifica o cálculo do segundo ano com taxa 5%
    const growthRate = 1 + rate / 100;
    const expectedSecondYearAssets = Number((initialAssets * growthRate).toFixed(2));
    expect(body[1].assets).toBe(expectedSecondYearAssets);
  });

  test("GET / - retorna erro se initialAssets não informado", async () => {
    const response = await app.inject({
      method: "GET",
      url: `/projection`,
    });

    expect(response.statusCode).toBe(400);
  });
});
