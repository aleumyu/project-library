import { Module } from '@nestjs/common';
import { CpuTestController } from './cpu-test.contoller';
import { CpuTestService } from './cpu-test.service';

@Module({
  controllers: [CpuTestController],
  providers: [CpuTestService],
})
export class CpuTestModule {}
