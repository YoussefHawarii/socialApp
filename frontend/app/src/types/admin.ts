import type { User } from './user';
import type { Post } from './post';
import type { Role } from '@/lib/constants';

// The admin overview endpoint returns raw posts with no `.populate()`, so `user` is an id, not a PostAuthor.
export type AdminPost = Omit<Post, 'user'> & { user: string };

export interface AdminOverviewResponse {
  success: true;
  results: [User[], AdminPost[]];
}

export interface ChangeUserRoleRequest {
  userId: string;
  role: Role;
}
