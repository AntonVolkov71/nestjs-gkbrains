import { PartialType } from '@nestjs/mapped-types';
import { CreateCalculatorDto } from './create-calculator.dto';

export class UpdateCalculatorDto extends PartialType(CreateCalculatorDto) {}
