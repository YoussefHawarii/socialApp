import type { PostAuthor, PostImage } from './post';

// The backend populates the comment author on some endpoints (GET /post/getPost/:id)
// but not others (GET /post/:postId/comment/), so callers must handle both shapes.
export type CommentAuthor = string | PostAuthor;

export interface Comment {
  _id: string;
  post: string;
  user: CommentAuthor;
  text?: string;
  image?: PostImage;
  isDeleted: boolean;
  deletedBy?: string;
  likes: string[] | PostAuthor[];
  parentComment?: string;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentResponse {
  success: true;
  results: { data: Comment };
}

export interface UpdateCommentResponse {
  success: true;
  results: { comment: Comment };
}

export interface SoftDeleteCommentResponse {
  success: true;
  results: { comment: Comment };
}

export interface GetCommentResponse {
  success: true;
  results: { comments: Comment[] };
}

export interface LikeUnlikeCommentResponse {
  success: true;
  message: string;
  comment: Comment;
}

export interface ReplyCommentResponse {
  success: true;
  results: { reply: Comment };
}
