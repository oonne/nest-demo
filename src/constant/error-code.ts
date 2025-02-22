const ErrorCode = {
  // 未知错误
  UNKNOWN_ERROR: 1000000,
  // 非法请求
  INVALID_REQUEST: 1000001,

  /*
   * Auth模块
   */
  // 无须初始化
  AUTH_NO_INIT: 1001001,
  // 登录失败
  AUTH_LOGIN_FAILED: 1001002,
  // 换票失败
  AUTH_REFRESH_TOKEN_FAILED: 1001003,

  /*
   * Staff模块
   */
  // 账号名必须唯一
  STAFF_NAME_UNIQUE: 1002001,
  // 用户不存在
  STAFF_NOT_FOUND: 1002002,

  /*
   * Recycle模块
   */
  // 回收项不存在
  RECYCLE_NOT_FOUND: 1003001,
  // 回收失败
  RECYCLE_FAILED: 1003002,

  /*
   * Setting模块
   */
  // 设置不存在
  SETTING_NOT_FOUND: 1004001,
  // 设置键必须唯一
  SETTING_KEY_UNIQUE: 1004002,

  /*
   * File模块
   */
  // 文件不存在
  FILE_NOT_FOUND: 1005001,
  // 未收到上传的文件
  FILE_NOT_RECEIVED: 1005001,
  // 文件MD5错误
  FILE_MD5_ERROR: 1005002,
  // 文件已存在
  FILE_EXISTS: 1005003,
  // 文件上传失败
  FILE_UPLOAD_FAILED: 1005004,
  // 文件删除失败
  FILE_DELETE_FAILED: 1005005,

  /*
   * Blog模块
   */
  // 博客不存在
  BLOG_NOT_FOUND: 1006001,
};

export default ErrorCode;
