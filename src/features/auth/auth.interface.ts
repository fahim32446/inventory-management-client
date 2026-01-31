export interface ILoginBody {
  user_or_email: string;
  password: string;
  otp?: string;
}

export type PERMISSION_TYPE =
  | 'sale:create'
  | 'sale:read'
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

export interface ILoginResponse {
  success: boolean;
  message: string;
  data: ILoginData | null;
  accessToken: string | null;
}

export interface ILoginData {
  id: number;
  name: string;
  company_name: string;
  email: string;
  two_fa?: boolean;
  type: string;
  role: IRole;
  phone_number?: string;
  photo?: string;
  permission: PERMISSION_TYPE[] | null;
}

export interface IRole {
  roleId: 1;
  name: string;
  orgId: number | null;
  isAdmin: boolean;
}

export interface ISendEmailVerificationBody {
  email: string;
  type: 'reset_admin' | 'reset_employee';
}

export interface IMatchOTPVerificationBody {
  email: string;
  otp: string;
  type: 'reset_admin' | 'reset_employee';
}

export interface IMatchOTPResponse {
  success: boolean;
  message: string;
  token: string;
}

export interface IResetPasswordBody {
  token: string;
  password: string;
}

export interface IProfileDataResponse {
  success: boolean;
  message: string;
  data: ILoginData | null;
}
export interface IUpdateProfileBody {
  username?: string;
  name?: string;
  email?: string;
  phone_number?: string;
}

export interface IChangePasswordBody {
  old_password: string;
  new_password: string;
}

export interface IToggle2FABody {
  two_fa: boolean;
}

export interface ICurrentLogin {
  user_id: number;
  refresh_token_hash: string;
  user_agent: string;
  ip_address: string;
  location: string;
  device: string;
  is_revoked: boolean;
  expires_at: string;
  created_at: string;
  user_type: string;
  id: string;
}
