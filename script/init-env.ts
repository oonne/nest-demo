import * as fs from 'fs';

const initEnv = () => {
  if (!fs.existsSync('.env.local')) {
    console.log('未找到.env.local文件，初始化失败');
    return;
  }

  // 读取.env.local文件内容
  let envLocalContent = fs.readFileSync('.env.local', 'utf8');
  envLocalContent = envLocalContent.replace('ENV_NAME = local', 'ENV_NAME = prod');

  // 如果不存在.env文件，则创建一个.env文件
  if (!fs.existsSync('.env')) {
    fs.writeFileSync('.env', envLocalContent);
  }

  // 初始化完成
  console.log('已初始化，请修改.env文件');
};

initEnv();
