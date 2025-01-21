/* 角色类型 */
interface IRole {
  key: number;
  name: string;
}

const roleList: IRole[] = [
  {
    key: 1,
    name: '超级管理员',
  },
  {
    key: 2,
    name: '合伙人',
  },
];

export default roleList;

/* 角色key枚举 */
export const roleKeyArr = roleList.map((item) => item.key);

/* 角色说明文案 */
export const roleDesc = roleList.map((item) => `${item.key} ${item.name} `).join(',');
