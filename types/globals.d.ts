import { PrismaClient } from '@prisma/client'

declare global {
  // This is needed to make TypeScript happy with globalThis.prisma
  let prisma: PrismaClient | undefined

  namespace NodeJS {
    interface Global {
      prisma: PrismaClient | undefined
    }
  }
}

export {}
