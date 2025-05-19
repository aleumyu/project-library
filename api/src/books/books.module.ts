import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  controllers: [BooksController],
  providers: [BooksService],
  imports: [PrismaModule, AuthModule],
})
export class BooksModule {}
