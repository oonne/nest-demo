import { HttpResponse } from '../types/interface';

/*
 * 返回成功的的公共方法
 */
const resSuccess = <T>(data: T): HttpResponse<T> => {
  return {
    code: 0,
    message: '',
    data,
  };
};

export default resSuccess;
