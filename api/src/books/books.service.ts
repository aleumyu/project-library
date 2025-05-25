import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    const book = {
      title: createBookDto.title,
      author: createBookDto.author,
      description: createBookDto.description,
      category: createBookDto.category,
      publisher: createBookDto.publisher,
      year: createBookDto.year,
    };

    try {
      return await this.prisma.book.create({
        data: book,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll() {
    try {
      return await this.prisma.book.findMany();
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: string) {
    try {
      return await this.prisma.book.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    try {
      return await this.prisma.book.update({
        where: { id },
        data: updateBookDto,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.book.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
