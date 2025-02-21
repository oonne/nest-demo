import {
  Equal,
  MoreThanOrEqual,
  MoreThan,
  LessThanOrEqual,
  LessThan,
  Like,
  ILike,
  FindOperator,
} from 'typeorm';

/*
 * 返回字符串字段筛选的条件
 */
const getStringCondition = (searchText: string): FindOperator<string> => {
  if (!searchText) {
    return undefined;
  }

  // 当以=开头时，返回等于该值的条件
  if (searchText.startsWith('=')) {
    return Equal(searchText.substring(1));
  }

  // 否则返回ILike条件
  return ILike(`%${searchText}%`);
};

/*
 * 返回数字字段筛选的条件
 */
const getNumberCondition = (searchText: string): FindOperator<number> => {
  if (!searchText) {
    return undefined;
  }

  // 当以=开头时，返回等于该值的条件
  if (searchText.startsWith('=')) {
    return Equal(Number(searchText.substring(1)));
  }

  // 当以>=开头时，返回大于等于该值的条件
  if (searchText.startsWith('>=')) {
    return MoreThanOrEqual(Number(searchText.substring(2)));
  }

  // 当以>开头时，返回大于该值的条件
  if (searchText.startsWith('>')) {
    return MoreThan(Number(searchText.substring(1)));
  }

  // 当以<=开头时，返回小于等于该值的条件
  if (searchText.startsWith('<=')) {
    return LessThanOrEqual(Number(searchText.substring(2)));
  }

  // 当以<开头时，返回小于该值的条件
  if (searchText.startsWith('<')) {
    return LessThan(Number(searchText.substring(1)));
  }

  // 否则返回Like条件（对数字进行Like性能较差）
  return Like(`%${searchText}%`) as any;
};

export default {
  getStringCondition,
  getNumberCondition,
};
