import * as fs from 'fs';

const initEnv = () => {
  // 读取.env.local文件内容
  const envLocalContent = fs.readFileSync('.env.local', 'utf8');

  // 如果不存在.env文件，则创建一个.env文件
  if (!fs.existsSync('.env')) {
    fs.writeFileSync('.env', envLocalContent);
  }
  console.log('已初始化，请修改.env文件');
};

initEnv();
