import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { LoansService } from './loans.service';
import { CreateLoanDto, UpdateLoanDto } from './dto/create-loan.dto';
import { AuthGuard, RequestWithUser } from 'src/auth/auth.guard';
import { Loan } from './entities/loan.entity';

@ApiBearerAuth()
@ApiTags('loans')
@UseGuards(AuthGuard)
@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new loan' })
  @ApiBody({ type: CreateLoanDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The loan has been successfully created.',
    type: Loan,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  async create(
    @Body() createLoanDto: CreateLoanDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.loansService.create(createLoanDto, req.user.userId);
  }

  @Get('/user')
  @ApiOperation({ summary: 'Retrieve all loans for a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved all loans for the user.',
    type: [Loan],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  async findAll(@Req() req: RequestWithUser) {
    return await this.loansService.findAllByUser(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a loan by its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the loan to retrieve',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved the loan.',
    type: Loan,
  })
  async findOne(@Param('id') id: string) {
    return await this.loansService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a loan for returning a books by its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the loan to update',
    type: String,
  })
  @ApiBody({ type: UpdateLoanDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The loan has been successfully updated.',
    type: Loan,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  async update(@Param('id') id: string, @Body() updateLoanDto: UpdateLoanDto) {
    return await this.loansService.update(id, updateLoanDto);
  }
}
