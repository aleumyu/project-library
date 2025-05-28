import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Loan } from '../../loans/entities/loan.entity';

export class User {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: 'b1e3f5a2-7c9d-4b1e-8f0a-9c8d7e6f5a4b',
    type: String,
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
    type: String,
    format: 'email',
  })
  email: string;

  // Do NOT include password in the entity returned by API responses

  @ApiPropertyOptional({
    description: 'List of loans associated with the user.',
    type: () => [Loan],
  })
  loan?: Loan[];
}
