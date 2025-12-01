import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const connectToDatabase = async (): Promise<void> => {
  await prisma.$connect();
};

