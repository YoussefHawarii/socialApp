import type { Role } from '@/lib/constants';

export interface ProfilePicture {
  public_id: string;
  secure_url: string;
}

export interface User {
  _id: string;
  email: string;
  userName: string;
  role: Role;
  isActivated: boolean;
  provider: 'system' | 'google';
  tempEmail: string | null;
  profilePicture: ProfilePicture;
  pictures: string[];
  friends: User[] | string[];
  friendRequests: User[] | string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  success: true;
  results: User;
}

export interface UpdateProfileRequest {
  userName: string;
}

export interface UpdateProfileResponse {
  success: true;
  results: User;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateEmailRequest {
  email: string;
  password: string;
}

export interface UploadProfilePictureResponse {
  success: true;
  results: { user: User };
}
