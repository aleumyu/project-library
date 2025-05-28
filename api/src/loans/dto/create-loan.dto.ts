import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLoanDto {
  @ApiProperty({
    description: 'The ID of the book to be loaned',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    type: String,
    format: 'uuid',
  })
  bookId: string;
}
export class UpdateLoanDto extends PartialType(CreateLoanDto) {}
