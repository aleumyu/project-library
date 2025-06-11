import { Controller, Get, Logger, Query } from '@nestjs/common';
import { CpuTestService } from './cpu-test.service';

@Controller('cpu-test')
export class CpuTestController {
  private readonly logger = new Logger(CpuTestController.name);

  constructor(private readonly cpuTestService: CpuTestService) {}

  @Get('fibonacci')
  getFibonacci(@Query('n') n: number) {
    const result = this.cpuTestService.fibonacci(n);
    this.logger.log(`Fibonacci calculated: ${result}`);
    return result;
  }
}
