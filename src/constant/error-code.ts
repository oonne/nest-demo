const ErrorCode = {
  // 未知错误
  UNKNOWN_ERROR: 10000,
  // 非法请求
  INVALID_REQUEST: 10001,

  /* Auth模块 */
  // 登录失败
  AUTH_LOGIN_FAILED: 10001,

  /* Staff模块 */
  // 用户名必须唯一
  STAFF_USERNAME_UNIQUE: 10002,
  // 用户不存在
  STAFF_NOT_FOUND: 10003,
};

export default ErrorCode;
