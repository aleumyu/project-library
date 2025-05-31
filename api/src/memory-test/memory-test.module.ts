import { Module } from '@nestjs/common';
import { MemoryTestService } from './memory-test.service';
import { MemoryTestController } from './memory-test.controller';
import { HeapdumpService } from 'src/common/service/heapdump.service';

@Module({
  controllers: [MemoryTestController],
  providers: [MemoryTestService, HeapdumpService],
})
export class MemoryTestModule {}
