import { IPermission } from './permission';

export interface IRole {
  id: number;
  roleName: string;
  rolePermissions: IPermission[];
}