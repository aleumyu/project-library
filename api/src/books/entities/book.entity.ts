import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Loan } from '../../loans/entities/loan.entity'; // Example import

export class Book {
  @ApiProperty({
    description: 'The unique identifier of the book',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    type: String,
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'The title of the book',
    example: 'Cien años de soledad',
    type: String,
  })
  title: string;

  @ApiProperty({
    description: 'The author of the book',
    example: 'Gabriel García Márquez',
    type: String,
  })
  author: string;

  @ApiProperty({
    description: 'A brief description of the book',
    example: 'Una novela de amor y tragedia en la selva colombiana.',
    type: String,
  })
  description: string;

  @ApiProperty({
    description: 'The category or genre of the book',
    example: 'Novel',
    type: String,
  })
  category: string;

  @ApiProperty({
    description: 'The publisher of the book',
    example: 'Sudamericana',
    type: String,
  })
  publisher: string;

  @ApiProperty({
    description: 'The year the book was published',
    example: 1967,
    type: Number,
  })
  year: number;

  @ApiProperty({
    description: 'The date and time the book record was created',
    example: '2023-01-15T10:30:00.000Z',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the book record was last updated',
    example: '2023-01-16T12:45:00.000Z',
    type: Date,
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'The loan associated with this book, if any.',
    type: () => Loan,
  })
  loan?: Loan;
}
