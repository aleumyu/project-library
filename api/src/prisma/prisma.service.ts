import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';
import { MetricsService } from 'src/metrics/metrics.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly metricsService: MetricsService) {
    super();
    return this.$extends({
      query: {
        $allOperations: async ({ model, operation, args, query }) => {
          const query_type = model ? `${model}.${operation}` : operation;
          const endTimer =
            this.metricsService.dbQueryDurationHistogram.startTimer();
          try {
            const result = await query(args);
            return result;
          } catch (error) {
            throw error;
          } finally {
            endTimer({ query_type });
          }
        },
      },
    }) as this;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
