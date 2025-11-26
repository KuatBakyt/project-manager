export interface LoginResponse {
  token: string;
  username?: string;
  id?: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export type LoginForm = {
  username: string;
  password: string;
};

export type PasswordFormValues = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};
