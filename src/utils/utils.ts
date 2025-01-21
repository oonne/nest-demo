import * as CryptoJS from 'crypto-js';
import type { Timer } from '../types/type';

/**
 *  获取n位的数字随机数
 */
const randomDigits = (n: number): number => {
  if (n > 21) {
    return 0;
  }
  return Math.round((Math.random() + 1) * 10 ** (n - 1));
};

/**
 *  获取n以内的随机整数
 */
const randomWithin = (n: number): number => Math.floor(Math.random() * n);

/**
 *  获取n位的随机数字或字母
 */
const randomChars = (n: number): string => {
  const arr: string[] = [];
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

  for (let i = 0; i < n; i += 1) {
    arr.push(chars[randomWithin(chars.length)]);
  }

  return arr.join('');
};

/*
 * 获取哈希值
 */
const createHash = (text: string, maxLen?: number): string => {
  const length = maxLen || 16;
  let hashedText = CryptoJS.SHA256(text).toString();
  if (hashedText.length > length) {
    hashedText = hashedText.substring(0, length);
  }
  return hashedText;
};

/*
 * 生成ID
 * 规则: 前缀+ 哈希值 (时间戳 + 随机字符串)
 */
const generateId = (prefix?: string): string => {
  const time = Date.now();
  const randomStr = randomChars(8);
  const hash = createHash(`${time}${randomStr}`);

  if (!prefix) {
    return hash;
  }
  return `${prefix}-${hash}`;
};

/**
 *  延迟一定时间，单位毫秒。
 */
const sleep = async (time: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

/**
 * 函数防抖
 */
const debounce = <T extends (...args: any[]) => void>(fn: T, waitTime: number) => {
  let timer: Timer = null;

  return (...args: any[]) => {
    if (timer !== null) {
      clearTimeout(timer);
    }

    // 停止触发n秒后才执行
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, waitTime);
  };
};

export default {
  randomDigits,
  randomWithin,
  randomChars,
  createHash,
  generateId,
  sleep,
  debounce,
};
