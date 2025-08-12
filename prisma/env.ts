// src/config/env.ts
import dotenv from 'dotenv';

dotenv.config();

function getEnvVariable(key: string, required = true): string {
  const value = process.env[key];
  if (!value && required) {
    throw new Error(`Missing required env variable: ${key}`);
  }
  return value!;
}

export const env = {
  DB_USER: getEnvVariable('DB_USER'),
  DB_PASSWORD: getEnvVariable('DB_PASSWORD'),
  DB_NAME: getEnvVariable('DB_NAME'),
  BACKEND_PORT: getEnvVariable('BACKEND_PORT'),
  
  // Gera DATABASE_URL dinamicamente
  get DATABASE_URL(): string {
    return `postgresql://${this.DB_USER}:${this.DB_PASSWORD}@localhost:5432/${this.DB_NAME}`;
  }
};
