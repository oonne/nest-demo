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
      // 递归查找第一个有约束的错误信息
      const getFirstConstraintError = (error: any): string | null => {
        if (error.constraints && Object.keys(error.constraints).length > 0) {
          return Object.values(error.constraints)[0] as string;
        }
        if (error.children && error.children.length > 0) {
          for (const child of error.children) {
            const childError = getFirstConstraintError(child);
            if (childError) {
              return childError;
            }
          }
        }
        return null;
      };

      const firstError = getFirstConstraintError(errors[0]);
      const errorMsg = firstError
        ? `Request parameters are error: ${firstError}`
        : `Request parameters are error: ${errors[0].property || 'unknown field'}`;
      throw new BadRequestException(errorMsg);
    }
    return value;
  }

  private toValidate(metatype: new (...args: any[]) => any): boolean {
    const types: (new (...args: any[]) => any)[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
