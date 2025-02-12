const ErrorCode = {
  // 未知错误
  UNKNOWN_ERROR: 10000,
  // 非法请求
  INVALID_REQUEST: 10001,

  /*
   * Auth模块
   */
  // 无须初始化
  AUTH_NO_INIT: 10101,
  // 登录失败
  AUTH_LOGIN_FAILED: 10102,
  // 换票失败
  AUTH_REFRESH_TOKEN_FAILED: 10103,

  /*
   * Staff模块
   */
  // 账号名必须唯一
  STAFF_NAME_UNIQUE: 10201,
  // 用户不存在
  STAFF_NOT_FOUND: 10202,

  /*
   * Recycle模块
   */
  // 回收项不存在
  RECYCLE_NOT_FOUND: 10301,
  // 回收失败
  RECYCLE_FAILED: 10302,

  /*
   * Setting模块
   */
  // 设置不存在
  SETTING_NOT_FOUND: 10401,
  // 设置键必须唯一
  SETTING_KEY_UNIQUE: 10402,
};

export default ErrorCode;
