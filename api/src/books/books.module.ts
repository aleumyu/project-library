import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [BooksController],
  providers: [BooksService],
  imports: [PrismaModule],
})
export class BooksModule {}
