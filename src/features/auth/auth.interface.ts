export interface ILoginBody {
  user_or_email: string;
  password: string;
  otp?: string;
}

export interface ILoginResponse {
  success: boolean;
  message: string;
  data: ILoginData | null;
}

export interface ILoginData {
  id: number;
  name: string;
  company_name: string;
  email: string;
  two_fa?: boolean;
  type: string;
  accessToken: string;
  role: IRole;
}

export interface IRole {
  id: number;
  role_name: string;
  status: boolean;
  is_main_role: boolean;
  create_date: string;
  created_by: string;
  created_by_name: string;
}

export interface ISendEmailVerificationBody {
  email: string;
  type: "reset_admin" | "reset_employee";
}

export interface IMatchOTPVerificationBody {
  email: string;
  otp: string;
  type: "reset_admin" | "reset_employee";
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
  // id: number;
  // username: string;
  // name: string;
  // email: string;
  // phone_number: string;
  // photo: string;
  // status: boolean;
  // create_date: string;
  // is_main_user: boolean;
  // socket_id: string;
  // two_fa: boolean;
  // role: string;
  // created_by_name: string;
  // permissions: IRole;

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
