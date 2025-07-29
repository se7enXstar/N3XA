import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Only create Prisma client if we're not in a build environment
const createPrismaClient = () => {
  if (process.env.PRISMA_MOCK === 'true' || (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL)) {
    // Return a mock client during build
    return {
      category: {
        findMany: async () => [],
        create: async () => ({ id: 'mock' }),
        findUnique: async () => null,
        update: async () => ({ id: 'mock' }),
        delete: async () => ({ id: 'mock' })
      },
      ticket: {
        findMany: async () => [],
        create: async () => ({ id: 'mock' }),
        findUnique: async () => null,
        update: async () => ({ id: 'mock' }),
        delete: async () => ({ id: 'mock' })
      }
    } as any
  }
  
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 