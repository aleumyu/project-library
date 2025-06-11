import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { LoansModule } from './loans/loans.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import authConfig from './config/authConfig';
import { MemoryMonitorService } from './common/service/memory-monitor.service';
import { HeapdumpService } from './common/service/heapdump.service';
// import { AuthGuard } from './auth/auth.guard';
// import { APP_GUARD } from '@nestjs/core';
import { MemoryTestModule } from './memory-test/memory-test.module';
import { MetricsModule } from './metrics/metrics.module';
import { HttpMetricsMiddleware } from './common/middleware/metrics.middleware';
import { CpuTestModule } from './cpu-test/cpu-test.module';
@Module({
  imports: [
    PrismaModule,
    UsersModule,
    BooksModule,
    LoansModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig],
    }),
    MemoryTestModule,
    MetricsModule,
    CpuTestModule,
  ],
  controllers: [AppController],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
    AppService,
    MemoryMonitorService,
    HeapdumpService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpMetricsMiddleware).forRoutes('*'); // Apply to all routes
  }
}
