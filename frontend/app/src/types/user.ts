import type { Role } from '@/lib/constants';

export interface ProfilePicture {
  public_id: string;
  secure_url: string;
}

/** A friend/request participant as returned by populated fields — never the full User document. */
export interface FriendSummary {
  _id: string;
  userName: string;
  profilePicture: ProfilePicture;
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
  friends: FriendSummary[];
  /** Raw incoming-request ids — GET /user/profile never populates this; use GET /user/friend-requests instead. */
  friendRequests: string[];
  createdAt: string;
  updatedAt: string;
}

export type RelationshipStatus = 'not_friends' | 'pending_sent' | 'pending_received' | 'friends';

export interface SearchResultUser extends FriendSummary {
  status: RelationshipStatus;
}

export interface SearchUsersResponse {
  success: true;
  results: {
    data: SearchResultUser[];
    currentPage: number;
    totalPages: number;
  };
}

export interface FriendRequestsResponse {
  success: true;
  results: {
    incoming: FriendSummary[];
    sent: FriendSummary[];
  };
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
