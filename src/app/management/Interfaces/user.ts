import { IRole } from './role';

export interface IUser {
  id: number;
  userName: string;
  email: string;
  isDisabled: boolean;
  userRoles: IRole[];
}