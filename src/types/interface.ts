/* HTTP接口默认返回数据格式 */
export interface HttpResponse<T> {
  code: number;
  message: string;
  data: T;
}
