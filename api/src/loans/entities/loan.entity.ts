import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Book } from '../../books/entities/book.entity';
import { User } from '../../users/entities/user.entity';

export class Loan {
  @ApiProperty({
    description: 'The unique identifier of the loan',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    type: String,
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'The ID of the book being loaned',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    type: String,
    format: 'uuid',
  })
  bookId: string;

  @ApiPropertyOptional({ type: () => Book })
  book?: Book;

  @ApiProperty({
    description: 'The ID of the user who borrowed the book',
    example: 'e0b3c4d5-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    type: String,
    format: 'uuid',
  })
  userId: string;

  @ApiPropertyOptional({ type: () => User })
  user?: User;

  @ApiProperty({
    description: 'The date and time the loan record was created',
    example: '2023-02-10T09:15:00.000Z',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the loan is due',
    example: '2023-03-10T09:15:00.000Z',
    type: Date,
  })
  dueDate: Date;

  @ApiPropertyOptional({
    description:
      'The date and time the book was returned. Null if not yet returned.',
    example: '2023-03-05T14:00:00.000Z',
    type: Date,
    nullable: true,
  })
  returnedAt?: Date | null;

  @ApiProperty({
    description: 'The date and time the loan record was last updated',
    example: '2023-03-05T14:00:00.000Z',
    type: Date,
  })
  updatedAt: Date;
}
