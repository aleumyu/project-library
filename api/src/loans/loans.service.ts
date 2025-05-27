import { Injectable } from '@nestjs/common';
import { CreateLoanDto, UpdateLoanDto } from './dto/create-loan.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LoansService {
  private readonly MAX_LOANS = 3;
  constructor(private readonly prisma: PrismaService) {}
  async create(createLoanDto: CreateLoanDto, userId: string) {
    const canLoanBook = await this.canLoanBook(userId);
    if (!canLoanBook) {
      throw new Error('User cannot loan more books');
    }
    const data = {
      bookId: createLoanDto.bookId,
      userId,
      dueDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
    };
    const loan = await this.prisma.loan.create({
      data,
    });
    return loan;
  }

  async findAllByUser(userId: string) {
    return await this.prisma.loan.findMany({
      where: {
        userId,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.loan.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateLoanDto: UpdateLoanDto) {
    const data = {
      ...updateLoanDto,
      returnedAt: new Date(),
    };
    return await this.prisma.loan.update({
      where: {
        id,
      },
      data,
    });
  }

  async canLoanBook(userId: string) {
    let canLoan = false;
    const loansByUser = await this.findAllByUser(userId);
    const shouldReturn =
      loansByUser.filter((loan) => loan.dueDate < new Date()).length > 0;
    if (loansByUser.length < this.MAX_LOANS) {
      canLoan = true;
    }
    if (!shouldReturn) {
      canLoan = true;
    }
    return canLoan;
  }
}
