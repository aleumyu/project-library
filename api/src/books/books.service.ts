import { Injectable, NotFoundException } from '@nestjs/common';
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

    return await this.prisma.book.create({
      data: book,
    });
  }

  async findAll() {
    return await this.prisma.book.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.book.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const existingBook = await this.findOne(id);
    if (!existingBook) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }
    return await this.prisma.book.update({
      where: { id },
      data: updateBookDto,
    });
  }

  async remove(id: string) {
    const existingBook = await this.findOne(id);
    if (!existingBook) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }
    return await this.prisma.book.delete({
      where: { id },
    });
  }
}
