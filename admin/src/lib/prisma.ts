import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  console.log("[prisma] TURSO_DATABASE_URL defined:", !!url);
  console.log("[prisma] TURSO_AUTH_TOKEN defined:", !!authToken);
  console.log("[prisma] NODE_ENV:", process.env.NODE_ENV);

  if (url && authToken) {
    console.log("[prisma] Using Turso adapter");
    const libsql = createClient({ url, authToken });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adapter = new PrismaLibSql(libsql as any);
    return new PrismaClient({ adapter } as never);
  }

  console.log("[prisma] Using default PrismaClient (no Turso)");
  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
