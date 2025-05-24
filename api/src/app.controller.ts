import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { HeapdumpService } from './common/service/heapdump.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(
    private readonly appService: AppService,
    private readonly heapdumpService: HeapdumpService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('debug/heapdump')
  async triggerHeapdump(): Promise<{
    message: string;
    filename?: string;
    error?: string;
  }> {
    this.logger.log('triggering heap dump.');
    try {
      const filename = await this.heapdumpService.triggerHeapSnapshot(
        'books-controller-trigger',
      );
      return { message: 'Heap dump initiated successfully.', filename };
    } catch (error: any) {
      this.logger.error('Failed to trigger heap dump:', error);
      return { message: 'Failed to initiate heap dump.', error: error.message };
    }
  }
}
