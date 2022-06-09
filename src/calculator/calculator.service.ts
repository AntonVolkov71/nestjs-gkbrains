import { Injectable } from '@nestjs/common';
import { CreateCalculatorDto } from './dto/create-calculator.dto';

@Injectable()
export class CalculatorService {
  calculator(
    operand: string | string[],
    createCalculatorDto: CreateCalculatorDto,
  ): number {
    let result = 0;
    if (typeof operand === 'string') {
      Object.values(createCalculatorDto).forEach((item, index) => {
        index === 0
          ? (result = Number.parseInt(item))
          : (result = this.calculation(operand, result, Number.parseInt(item)));
      });
    }
    return result;
  }

  private calculation(operand: string, a: number, b: number): number {
    switch (operand) {
      case 'plus':
        return a + b;
      case 'minus':
        return a - b;
      case 'multiplication':
        return a * b;
      case 'division':
        return a / b;
      default:
        return 0;
    }
  }
}
