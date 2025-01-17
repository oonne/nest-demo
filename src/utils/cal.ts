import Big from 'big.js';

/**
 * 乘法
 */
const times = (...args: number[]): number => {
  if (args.length === 0) {
    return NaN;
  }
  const product = args.reduce((acc, curr) => acc.times(new Big(curr || 0)), new Big(1));
  return product.toNumber();
};

/**
 * 除法
 * @param arg1
 * @param arg2
 * @returns
 */
const divide = (...args: number[]): number => {
  if (args.length === 0) {
    return NaN;
  }
  const result = args.slice(1).reduce((acc, curr) => acc.div(new Big(curr || 0)), new Big(args[0]));
  return result.toNumber();
};

/**
 * 加法
 */
const plus = (...args: number[]): number => {
  const sum = args.reduce((acc, curr) => acc.plus(new Big(curr || 0)), new Big(0));
  return sum.toNumber();
};

/**
 * 减法
 */
const minus = (...args: number[]): number => {
  if (args.length === 0) {
    return NaN;
  }
  const result = args
    .slice(1)
    .reduce((acc, curr) => acc.minus(new Big(curr || 0)), new Big(args[0]));
  return result.toNumber();
};

/**
 * 向上取整
 */
const ceil = (num: number, decimalPlaces = 0): number => {
  const multiple = 10 ** decimalPlaces;
  return divide(Math.ceil(times(num, multiple)), multiple);
};

/**
 * 向下取整
 */
const floor = (num: number, decimalPlaces = 0): number => {
  const multiple = 10 ** decimalPlaces;
  return divide(Math.floor(times(num, multiple)), multiple);
};

/*
 * 将小数转为百分比
 */
const toPercentage = (num: number, decimalPlaces = 2): string => {
  const percentage = Number(times(num, 100).toFixed(decimalPlaces));
  return `${percentage}%`;
};

export default {
  times,
  divide,
  plus,
  minus,
  ceil,
  floor,
  toPercentage,
};
