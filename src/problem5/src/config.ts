import dotenv from 'dotenv';

dotenv.config();

const {
  PORT = '4000',
  DATABASE_URL = 'file:./dev.db',
  API_PREFIX = '/api',
} = process.env;

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = DATABASE_URL;
}

export const config = {
  port: Number(PORT),
  databaseUrl: DATABASE_URL,
  apiPrefix: API_PREFIX,
} as const;

