import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  Req,
  Render,
} from '@nestjs/common';
import { CalculatorService } from './calculator.service';
import { Request } from 'express';
import { CreateCalculatorDto } from './dto/create-calculator.dto';

@Controller('calculator')
export class CalculatorController {
  constructor(private readonly calculatorService: CalculatorService) {}

  @Get()
  // @Render('index')
  getHello(): { message: string } {
    return { message: 'Hello world!' };
  }

  @Patch()
  calc(@Req() request: Request, @Query() query: CreateCalculatorDto) {
    const headerOperand = request.headers['type-operation'];

    return this.calculatorService.calculator(headerOperand, query);
  }

  @Put()
  put(@Req() request: Request, @Body() body: CreateCalculatorDto) {
    const headerOperand = request.headers['type-operation'];

    return this.calculatorService.calculator(headerOperand, body);
  }
}
