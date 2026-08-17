export interface SendOtpRequest {
  email: string;
}

export interface RegisterRequest {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
  userName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: true;
  message: string;
  access_token: string;
  refresh_token: string;
}

export interface ForgetPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  success: true;
  message: string;
  access_token: string;
}

export interface GoogleLoginRequest {
  idToken: string;
}
