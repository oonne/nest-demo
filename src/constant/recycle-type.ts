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
];

export default recycleTypeList;

/* 回收站类型key枚举 */
export const recycleTypeKeyArr = recycleTypeList.map((item) => item.key);

/* 回收站类型说明文案 */
export const recycleTypeDesc = recycleTypeList.map((item) => `${item.key} ${item.name} `).join(',');
