import { PartialType } from '@nestjs/mapped-types';

export class CreateLoanDto {
  bookId: string;
  userId: string;
}
export class UpdateLoanDto extends PartialType(CreateLoanDto) {}
