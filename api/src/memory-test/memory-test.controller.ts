import { Controller, Get, Logger, Query } from '@nestjs/common';
import { MemoryTestService } from './memory-test.service';
import { HeapdumpService } from '../common/service/heapdump.service'; // Import HeapdumpService

@Controller('memory-test')
export class MemoryTestController {
  private readonly logger = new Logger(MemoryTestController.name);

  constructor(
    private readonly memoryTestService: MemoryTestService,
    private readonly heapdumpService: HeapdumpService,
  ) {}

  @Get('leak')
  getLeak(@Query('items') items: number) {
    this.memoryTestService.createLeak(items);
    this.logger.log('Leak created');
    return 'Leak created';
  }

  @Get('heapdump')
  getHeapdump() {
    const filename = this.heapdumpService.triggerHeapSnapshot();
    this.logger.log(`Heapdump created: ${filename}`);
    return 'Heapdump created';
  }
}
