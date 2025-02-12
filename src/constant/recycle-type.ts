/* 回收站类型 */
interface IRecycleType {
  key: number;
  name: string;
}

const recycleTypeList: IRecycleType[] = [
  {
    key: 1,
    name: '账号',
  },
  {
    key: 2,
    name: '配置',
  },
];

/* 回收站类型key枚举 */
const recycleTypeKeyArr = recycleTypeList.map((item) => item.key);

/* 回收站类型说明文案 */
const recycleTypeDesc = recycleTypeList.map((item) => `${item.key} ${item.name} `).join(',');

export { recycleTypeList, recycleTypeKeyArr, recycleTypeDesc };
