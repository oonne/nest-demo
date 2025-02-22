import {
  Equal,
  MoreThanOrEqual,
  MoreThan,
  LessThanOrEqual,
  LessThan,
  Like,
  ILike,
  FindOperator,
  Between,
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

/*
 * 返回日期字段筛选的条件
 * @param startDate 开始日期，格式：YYYY-MM-DD
 * @param endDate 结束日期，格式：YYYY-MM-DD
 */
const getDateRangeCondition = (
  startDate?: string,
  endDate?: string,
): FindOperator<Date> | { $gte?: Date; $lte?: Date } => {
  if (!startDate && !endDate) {
    return undefined;
  }

  const condition: { $gte?: Date; $lte?: Date } = {};

  if (startDate) {
    condition.$gte = new Date(startDate);
  }

  if (endDate) {
    // 设置为当天的最后一刻
    const endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999);
    condition.$lte = endDateTime;
  }

  return Between(condition.$gte, condition.$lte);
};

export default {
  getStringCondition,
  getNumberCondition,
  getDateRangeCondition,
};
