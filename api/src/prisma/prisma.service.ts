import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';
import { MetricsService } from 'src/metrics/metrics.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private metricsInterval: NodeJS.Timeout;
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly metricsService: MetricsService) {
    super();
    return this.$extends({
      query: {
        $allOperations: async ({ model, operation, args, query }) => {
          const query_type = model ? `${model}.${operation}` : operation;
          let status = 'success';
          const endTimer =
            this.metricsService.dbQueryDurationHistogram.startTimer();
          try {
            const result = await query(args);
            return result;
          } catch (error) {
            status = 'error';
            throw error;
          } finally {
            endTimer({ query_type, status });
          }
        },
      },
    }) as this;
  }

  async onModuleInit() {
    await this.$connect();
    this.metricsInterval = setInterval(async () => {
      try {
        const metrics = await this.$metrics.json();
        const openConnections =
          metrics.gauges.find((g) => g.key === 'prisma_pool_connections_open')
            ?.value ?? 0;
        this.metricsService.dbConnectionsGauge.set(openConnections);
      } catch (error) {
        this.logger.error('Failed to update Prisma metrics:', error);
      }
    }, 5000);
  }

  async onModuleDestroy() {
    await this.$disconnect();
    clearInterval(this.metricsInterval);
  }
}
