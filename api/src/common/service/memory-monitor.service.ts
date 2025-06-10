import * as v8 from 'v8';

import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { HeapdumpService } from './heapdump.service';
@Injectable()
export class MemoryMonitorService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MemoryMonitorService.name);
  private intervalId: NodeJS.Timeout | null = null;
  private readonly MEMORY_USAGE_THRESHOLD_PERCENT = 70;
  private isHeapdumpInProgress = false;

  constructor(private readonly heapdumpService: HeapdumpService) {}

  onModuleInit() {
    this.logger.log(
      'MemoryMonitorService initialized. Starting periodic memory logging.',
    );
    // To detect leaks, we'd watch for heapUsedMB steadily increasing over time
    // under consistent load without ever decreasing significantly after GC.
    this.intervalId = setInterval(async () => {
      const heapStats = v8.getHeapStatistics();
      const usage = process.memoryUsage();
      // Resident Set Size - total memory used by the process.
      const rssMB = (usage.rss / 1024 / 1024).toFixed(2);
      // Total heap size - total memory allocated for the process.  현재 확보된 공간
      const heapTotalMB = (usage.heapTotal / 1024 / 1024).toFixed(2);
      // Heap used - memory used by the process.
      const heapUsedMB = (usage.heapUsed / 1024 / 1024).toFixed(2);
      // External - memory used by the process for things like file descriptors, sockets, etc.
      const externalMB = (usage.external / 1024 / 1024).toFixed(2);
      // Array buffers - memory used by the process for things like buffers, etc.
      const arrayBuffersMB = (usage.arrayBuffers / 1024 / 1024).toFixed(2);

      const heapUsagePercentV8 =
        (heapStats.used_heap_size / heapStats.heap_size_limit) * 100;

      const heapUsedMBV8 = (heapStats.used_heap_size / 1024 / 1024).toFixed(2);
      // Heap limit - 확보 가능한 최대 한도
      const heapLimitMBV8 = (heapStats.heap_size_limit / 1024 / 1024).toFixed(
        2,
      );

      this.logger.verbose(
        `Memory Usage: RSS=${rssMB}MB, HeapTotal=${heapTotalMB}MB, HeapUsed=${heapUsedMB}MB, heapUsagePercentV8=${heapUsagePercentV8}%, HeapUsedV8=${heapUsedMBV8}MB, HeapLimitV8=${heapLimitMBV8}MB, External=${externalMB}MB, ArrayBuffers=${arrayBuffersMB}MB`,
      );
      if (
        heapUsagePercentV8 > this.MEMORY_USAGE_THRESHOLD_PERCENT &&
        !this.isHeapdumpInProgress
      ) {
        this.logger.warn(
          `Heap usage (${heapUsedMB}MB) exceeded threshold (${this.MEMORY_USAGE_THRESHOLD_PERCENT}%). Triggering heap dump.`,
        );
        try {
          this.isHeapdumpInProgress = true;
          await this.heapdumpService.triggerHeapSnapshot();
        } catch (error) {
          this.logger.error(
            `Error triggering heap dump: ${error.message}`,
            error,
          );
        } finally {
          this.isHeapdumpInProgress = false;
        }
      }
    }, 5000);
  }

  onModuleDestroy() {
    this.logger.log(
      'MemoryMonitorService destroying. Stopping periodic memory logging.',
    );
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
