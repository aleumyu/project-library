import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MetricsService } from '../../metrics/metrics.service';

@Injectable()
export class HttpMetricsMiddleware implements NestMiddleware {
  constructor(private readonly metricsService: MetricsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;

    const endTimer =
      this.metricsService.httpRequestDurationHistogram.startTimer();

    res.on('finish', () => {
      const { statusCode } = res;
      const route = originalUrl;
      endTimer({ method, route, status_code: statusCode.toString() });

      const heapUsed = process.memoryUsage().heapUsed;
      this.metricsService.httpRequestHeapUsageGauge.set(
        { method, route, status_code: statusCode.toString() },
        heapUsed,
      );

      this.metricsService.httpRequestsTotal.inc({
        method,
        route,
        status_code: statusCode.toString(),
      });
    });

    next();
  }
}
