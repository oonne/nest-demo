const ErrorCode = {
  // 未知错误
  UNKNOWN_ERROR: 10000,
  // 非法请求
  INVALID_REQUEST: 10001,

  /* Auth模块 */
  // 无须初始化
  AUTH_NO_INIT: 10101,
  // 登录失败
  AUTH_LOGIN_FAILED: 10102,

  /* Staff模块 */
  // 用户名必须唯一
  STAFF_USERNAME_UNIQUE: 10201,
  // 用户不存在
  STAFF_NOT_FOUND: 10202,
};

export default ErrorCode;
