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
 * 如果只传入一个日期，则搜索当天数据
 * 如果以,分隔传入两个日期，则搜索两个日期之间的数据
 */
const getDateRangeCondition = (
  dataString: string,
): FindOperator<Date> | { $gte?: Date; $lte?: Date } => {
  if (!dataString) {
    return undefined;
  }

  const [startDate, endDate] = dataString.split(',');

  if (!startDate) {
    return undefined;
  }

  const condition: { $gte?: Date; $lte?: Date } = {};

  if (startDate) {
    condition.$gte = new Date(startDate);
  }

  if (endDate) {
    // 如果传了结束日期，设置为当天的最后一刻
    const endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999);
    condition.$lte = endDateTime;
  } else {
    // 如果只传了开始日期，设置为当天的最后一刻
    const endDateTime = new Date(startDate);
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
