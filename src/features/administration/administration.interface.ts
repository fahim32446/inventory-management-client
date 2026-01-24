import type React from 'react';

export type IPermissionName =
  | 'sale:create'
  | 'sale:read'
  | 'sale:update'
  | 'sale:delete'
  | 'dashboard:read'
  | 'products:create'
  | 'products:read'
  | 'products:update'
  | 'products:delete'
  | 'category:create'
  | 'category:read'
  | 'category:update'
  | 'category:delete'
  | 'warehouse:create'
  | 'warehouse:read'
  | 'warehouse:update'
  | 'warehouse:delete'
  | 'suppliers:create'
  | 'suppliers:read'
  | 'suppliers:update'
  | 'suppliers:delete'
  | 'purchase:create'
  | 'purchase:read'
  | 'purchase:update'
  | 'purchase:delete'
  | 'report:read'
  | 'administration:read'
  | 'administration:update'
  | 'administration:users:create'
  | 'administration:users:read'
  | 'administration:users:update'
  | 'administration:users:delete'
  | 'administration:roles:create'
  | 'administration:roles:read'
  | 'administration:roles:update'
  | 'administration:roles:delete';

export interface IPermission {
  permissionId: number;
  key: IPermissionName;
}

export interface ICreateRole {
  name: string;
  permissionId: number[];
}

export interface IRoleList {
  key?: React.Key;
  roleId: number;
  name: string;
  isAdmin: boolean;
  action?: React.ReactNode;
}

export interface IRoleDetails {
  roleId: number;
  name: string;
  permissions: IPermission[];
}

export interface IUser {
  key?: React.Key;
  userId: number;
  name: string;
  email: string;
  type: string;
  roleName: string;
  action: React.ReactNode;
  roleId?: number;
}

export interface ICreateUser {
  id: number | null;
  name: string;
  email: string;
  password?: string;
  roleId: string;
}
