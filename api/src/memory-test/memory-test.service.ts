import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MemoryTestService {
  private readonly logger = new Logger(MemoryTestService.name);
  private leakyArray: any[] = [];

  constructor() {
    this.logger.log('MemoryTestService constructor');
  }

  createLeak(items: number) {
    for (let i = 0; i < items; i++) {
      this.leakyArray.push(
        new Array(1000).fill('leak').join('-') + Math.random(),
      );
    }
    this.logger.log(`Leaky array size: ${this.leakyArray.length}`);
  }
}
