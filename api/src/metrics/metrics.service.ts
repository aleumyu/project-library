import { Injectable } from '@nestjs/common';
import {
  collectDefaultMetrics,
  Histogram,
  Registry,
  Gauge,
  Counter,
} from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly registry: Registry;
  public readonly httpRequestDurationHistogram: Histogram<string>;
  public readonly dbQueryDurationHistogram: Histogram<string>;
  public readonly dbConnectionsGauge: Gauge<string>;
  public readonly httpRequestHeapUsageGauge: Gauge<string>;
  public readonly httpRequestsTotal: Counter<string>;

  constructor() {
    this.registry = new Registry();
    collectDefaultMetrics({ register: this.registry });

    this.httpRequestDurationHistogram = new Histogram({
      name: 'http_request_duration_seconds_aleum',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
      registers: [this.registry],
    });

    this.dbQueryDurationHistogram = new Histogram({
      name: 'database_query_duration_seconds_aleum',
      help: 'Duration of database queries in seconds',
      labelNames: ['query_type', 'status'],
      buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5],
      registers: [this.registry],
    });

    this.dbConnectionsGauge = new Gauge({
      name: 'database_connections_active_aleum',
      help: 'Number of active database connections.',
      registers: [this.registry],
    });

    this.httpRequestHeapUsageGauge = new Gauge({
      name: 'http_request_heap_usage_bytes_aleum',
      help: 'Heap memory usage in bytes at the time an HTTP request finishes.',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.registry],
    });

    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total_aleum',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.registry],
    });
  }

  getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
  getPrometheusContentType(): string {
    return this.registry.contentType;
  }
}
