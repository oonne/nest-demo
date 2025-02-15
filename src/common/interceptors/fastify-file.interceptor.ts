import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Type,
  mixin,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export function FastifyFileInterceptor(fieldName: string): Type<NestInterceptor> {
  @Injectable()
  class MixinInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
      const req = context.switchToHttp().getRequest();

      const data = await req.file();
      if (data?.fieldname === fieldName) {
        req.incomingFile = data;
      }

      return next.handle();
    }
  }

  return mixin(MixinInterceptor);
}
