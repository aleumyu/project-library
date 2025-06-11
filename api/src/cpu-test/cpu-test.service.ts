import { Injectable } from '@nestjs/common';

@Injectable()
export class CpuTestService {
  fibonacci(n: number) {
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }
}
