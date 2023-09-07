import { Injectable } from '@nestjs/common';
import { TSumRequest, ISumResponse } from './interfaces/operation';

@Injectable()
export class MathService {
  generateSumWithLoop(sumRequest: TSumRequest): ISumResponse {
    const t1 = Date.now();
    let total = 0;
    for (let i = 1; i <= sumRequest.number; i++) {
      total += i;
    }
    const t2 = Date.now();
    return {
      success: true,
      result: total,
      timeInMili: t2 - t1,
    };
  }

  generateSumWithMultiplication(sumRequest: TSumRequest): ISumResponse {
    const t1 = Date.now();
    const total = (sumRequest.number * (sumRequest.number + 1)) / 2;
    const t2 = Date.now();
    return {
      success: true,
      result: total,
      timeInMili: t2 - t1,
    };
  }
}
