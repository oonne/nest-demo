import * as fs from 'fs';
import * as crypto from 'crypto';

const updateJwtSecret = () => {
  // 检查.env文件是否存在
  if (!fs.existsSync('.env')) {
    console.log('未找到.env文件');
    return;
  }

  // 读取.env文件内容
  const envContent = fs.readFileSync('.env', 'utf8');

  // 生成新的32位随机JWT_SECRET
  const newJwtSecret = crypto.randomBytes(32).toString('hex');

  // 替换JWT_SECRET
  const updatedContent = envContent.replace(/JWT_SECRET\s*=\s*.+/, `JWT_SECRET = ${newJwtSecret}`);

  // 写入更新后的内容到.env文件
  fs.writeFileSync('.env', updatedContent);

  console.log('JWT_SECRET已更新');
};

updateJwtSecret();
