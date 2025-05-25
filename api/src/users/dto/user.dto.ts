import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export class LoginDto {
  email: string;
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
