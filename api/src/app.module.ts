import { Module } from '@nestjs/common';
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
export class AppModule {}
