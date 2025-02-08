import * as fs from 'fs';
import * as crypto from 'crypto';
const initEnv = () => {
  if (fs.existsSync('.env')) {
    console.log('已存在.env文件，无须初始化');
    return;
  }
  if (!fs.existsSync('.env.local')) {
    console.log('未找到.env.local文件，初始化失败');
    return;
  }

  // 读取.env.local文件内容
  let envLocalContent = fs.readFileSync('.env.local', 'utf8');

  // 创建一个.env文件，将ENV_NAME设置为prod
  envLocalContent = envLocalContent.replace('ENV_NAME = local', 'ENV_NAME = prod');
  // 生成32位随机JWT_SECRET
  envLocalContent = envLocalContent.replace(
    /JWT_SECRET\s*=\s*.+/,
    `JWT_SECRET = ${crypto.randomBytes(32).toString('hex')}`,
  );
  // 写入.env文件
  fs.writeFileSync('.env', envLocalContent);

  // 初始化完成
  console.log('初始化完成，请修改.env文件');
};

initEnv();
