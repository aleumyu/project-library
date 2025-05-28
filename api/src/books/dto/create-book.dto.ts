import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({
    example: 'The Lord of the Rings',
    description: 'The title of the book',
  })
  title: string;

  @ApiProperty({
    example: 'J.R.R. Tolkien',
    description: 'The author of the book',
  })
  author: string;

  @ApiProperty({
    example: 'An epic fantasy novel.',
    description: 'A brief description of the book',
  })
  description: string;

  @ApiProperty({
    example: 'Fantasy',
    description: 'The category or genre of the book',
  })
  category: string;

  @ApiProperty({
    example: 'Allen & Unwin',
    description: 'The publisher of the book',
  })
  publisher: string;

  @ApiProperty({
    example: 1954,
    description: 'The year the book was published',
  })
  year: number;
}
