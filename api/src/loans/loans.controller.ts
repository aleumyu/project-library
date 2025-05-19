import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LoansService } from './loans.service';
import { CreateLoanDto, UpdateLoanDto } from './dto/create-loan.dto';
import { AuthGuard, RequestWithUser } from 'src/auth/auth.guard';
@UseGuards(AuthGuard)
@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  async create(
    @Body() createLoanDto: CreateLoanDto,
    @Req() req: RequestWithUser,
  ) {
    console.log(req.user);
    return await this.loansService.create(createLoanDto, req.user.userId);
  }

  @Get('/user')
  async findAll(@Req() req: RequestWithUser) {
    return await this.loansService.findAllByUser(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.loansService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLoanDto: UpdateLoanDto) {
    return await this.loansService.update(id, updateLoanDto);
  }
}
