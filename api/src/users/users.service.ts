import { compare, hash } from 'bcrypt';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.findUserByEmail(createUserDto.email);
    if (user) {
      throw new HttpException('user_already_exist', HttpStatus.CONFLICT);
    }

    const userCreated = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: await hash(createUserDto.password, 10),
      },
    });

    return userCreated;
  }

  async login(loginDto: LoginDto) {
    const user = await this.findUserByEmail(loginDto.email);
    if (!user) {
      throw new HttpException('user_not_found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }

    const token = this.authService.login(user);
    return {
      user,
      token,
    };
  }

  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }
}
