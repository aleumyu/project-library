import { Test, TestingModule } from '@nestjs/testing';
import { MemoryTestService } from './memory-test.service';

describe('MemoryTestService', () => {
  let service: MemoryTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemoryTestService],
    }).compile();

    service = module.get<MemoryTestService>(MemoryTestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
