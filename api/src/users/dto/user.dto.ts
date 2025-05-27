import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'Aleum',
    minLength: 2,
  })
  name: string;

  @ApiProperty({
    description: 'The email address of the user. Must be unique.',
    example: 'aleum@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The password for the user account. Minimum 8 characters.',
    example: 'SecureP@sswOrd123',
    minLength: 8,
  })
  password: string;
}

export class LoginDto {
  @ApiProperty({
    description: 'User email for login',
    example: 'aleum@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User password for login',
    example: 'SecureP@sswOrd123',
  })
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
