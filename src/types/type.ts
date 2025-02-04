/* 时间 */
export type Timer = ReturnType<typeof setTimeout> | null;
export type Interval = ReturnType<typeof setInterval> | null;

/* HTTP接口默认返回数据格式 */
export interface HttpResponse<T> {
  code: number;
  message: string;
  data?: T;
}

/* 列表返回 */
export interface ListResponse<T> {
  list: T[];
  total: number;
  pageNo: number;
  [key: string]: any;
}
