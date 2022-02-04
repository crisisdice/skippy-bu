import { Global, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient, Prisma } from '@prisma/client'

@Global()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // TODO pass through config service
    const log: (Prisma.LogLevel | Prisma.LogDefinition)[] = [
      { emit: 'stdout', level: 'query' },
      { emit: 'stdout', level: 'info' },
      { emit: 'stdout', level: 'warn' },
      { emit: 'stdout', level: 'error' },
    ]

    super({ log: process.env.PRISMA_LOG_LEVEL === 'error' ? log : undefined })
  }

  async onModuleInit(): Promise<void> {
    await this.$connect()
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect()
  }
}
