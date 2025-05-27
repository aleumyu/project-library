import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Book } from './entities/book.entity';

@ApiBearerAuth()
@ApiTags('books')
@UseGuards(AuthGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiBody({ type: CreateBookDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The book has been successfully created.',
    type: Book,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  async create(@Body() createBookDto: CreateBookDto) {
    return await this.booksService.create(createBookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all books' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved all books.',
    type: [Book],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  async findAll() {
    return await this.booksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a book by its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the book to retrieve',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved the book.',
    type: Book,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Book not found.' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  async findOne(@Param('id') id: string) {
    return await this.booksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a book by its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the book to update',
    type: String,
  })
  @ApiBody({ type: UpdateBookDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The book has been successfully updated.',
    type: Book,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Book not found.' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return await this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book by its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the book to delete',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The book has been successfully deleted.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Book not found.' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  async remove(@Param('id') id: string) {
    return await this.booksService.remove(id);
  }
}
