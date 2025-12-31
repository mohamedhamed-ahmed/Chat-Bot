import { PrismaClient } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import 'dotenv/config';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
   throw new Error('DATABASE_URL environment variable is not set');
}

const url = new URL(databaseUrl);
const adapter = new PrismaMariaDb({
   host: url.hostname,
   port: parseInt(url.port) || 3306,
   user: url.username,
   password: url.password,
   database: url.pathname.slice(1),
   connectionLimit: 5,
});

// Create a singleton PrismaClient instance
export const prisma = new PrismaClient({ adapter });

// Optional: Add graceful shutdown handling
process.on('beforeExit', async () => {
   await prisma.$disconnect();
});
