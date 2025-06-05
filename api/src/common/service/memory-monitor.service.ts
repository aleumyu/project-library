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
  private readonly HEAP_USAGE_THRESHOLD_MB = 200;
  private isHeapdumpInProgress = false;

  constructor(private readonly heapdumpService: HeapdumpService) {}

  onModuleInit() {
    this.logger.log(
      'MemoryMonitorService initialized. Starting periodic memory logging.',
    );
    // To detect leaks, we'd watch for heapUsedMB steadily increasing over time
    // under consistent load without ever decreasing significantly after GC.
    this.intervalId = setInterval(async () => {
      const usage = process.memoryUsage();
      // Resident Set Size - total memory used by the process.
      const rssMB = (usage.rss / 1024 / 1024).toFixed(2);
      // Total heap size - total memory allocated for the process.
      const heapTotalMB = (usage.heapTotal / 1024 / 1024).toFixed(2);
      // Heap used - memory used by the process.
      const heapUsedMB = (usage.heapUsed / 1024 / 1024).toFixed(2);
      // External - memory used by the process for things like file descriptors, sockets, etc.
      const externalMB = (usage.external / 1024 / 1024).toFixed(2);
      // Array buffers - memory used by the process for things like buffers, etc.
      const arrayBuffersMB = (usage.arrayBuffers / 1024 / 1024).toFixed(2);

      this.logger.verbose(
        `Memory Usage: RSS=${rssMB}MB, HeapTotal=${heapTotalMB}MB, HeapUsed=${heapUsedMB}MB, External=${externalMB}MB, ArrayBuffers=${arrayBuffersMB}MB`,
      );
      if (
        Number(heapUsedMB) > this.HEAP_USAGE_THRESHOLD_MB &&
        !this.isHeapdumpInProgress
      ) {
        this.logger.warn(
          `Heap usage (${heapUsedMB}MB) exceeded threshold (${this.HEAP_USAGE_THRESHOLD_MB}MB). Triggering heap dump.`,
        );
        await this.heapdumpService.triggerHeapSnapshot();
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
