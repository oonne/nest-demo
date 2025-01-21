/*
 * 校验请求参数的管道
 */
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);

    // 如果object是 undefined 或者是 null
    if (!object || Object.keys(object).length === 0) {
      throw new BadRequestException('Request parameters are empty');
    }

    // 如果不是合法的json格式
    if (typeof object !== 'object') {
      throw new BadRequestException('Request parameters is not a json format');
    }

    // 如果有多个错误，只抛出第一个错误
    const errors = await validate(object);
    if (errors.length > 0) {
      console.log(errors);
      const firstError = Object.values(errors[0].constraints);
      const errorMsg = `Request parameters are error: ${firstError}`;
      throw new BadRequestException(errorMsg);
    }
    return value;
  }

  private toValidate(metatype: new (...args: any[]) => any): boolean {
    const types: (new (...args: any[]) => any)[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
