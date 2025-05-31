import { Test, TestingModule } from '@nestjs/testing';
import { MemoryTestController } from './memory-test.controller';
import { MemoryTestService } from './memory-test.service';

describe('MemoryTestController', () => {
  let controller: MemoryTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemoryTestController],
      providers: [MemoryTestService],
    }).compile();

    controller = module.get<MemoryTestController>(MemoryTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
