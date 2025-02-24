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
 */
const getDateRangeCondition = (dataString: string): FindOperator<Date> | Date => {
  if (!dataString) {
    return undefined;
  }

  const [startDate, endDate] = dataString.split(',');
  if (!startDate) {
    return undefined;
  }
  // 如果只传入开始时间，则搜索当天数据
  if (!endDate) {
    const startDateTime = new Date(Number(startDate));
    startDateTime.setHours(0, 0, 0, 0);
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(23, 59, 59, 999);
    return Between(startDateTime, endDateTime);
  }

  // 开始时间为当天0点
  const startDateTime = new Date(Number(startDate));
  startDateTime.setHours(0, 0, 0, 0);
  // 结束时间为当天最后一刻
  const endDateTime = new Date(Number(endDate));
  endDateTime.setHours(23, 59, 59, 999);

  return Between(startDateTime, endDateTime);
};

export default {
  getStringCondition,
  getNumberCondition,
  getDateRangeCondition,
};
