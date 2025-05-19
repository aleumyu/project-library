import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  async create(@Body() createLoanDto: CreateLoanDto) {
    return await this.loansService.create(createLoanDto);
  }

  @Get()
  async findAll() {
    return await this.loansService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.loansService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLoanDto: UpdateLoanDto) {
    return await this.loansService.update(+id, updateLoanDto);
  }
}
