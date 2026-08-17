export interface PostImage {
  secure_url: string;
  public_id: string;
}

export interface PostAuthor {
  _id: string;
  userName: string;
  profilePicture: { secure_url: string };
}

export interface Post {
  _id: string;
  text?: string;
  images: PostImage[];
  user: PostAuthor;
  likes: string[] | PostAuthor[];
  isDeleted: boolean;
  deletedBy?: string;
  cloudFolder?: string;
  createdAt: string;
  updatedAt: string;
  comments?: unknown[];
}

export interface PaginatedPosts {
  data: Post[];
  currentPage: number;
  totalposts: number;
  totalPages: number;
  postsPerPage: number;
}

export interface CreatePostResponse {
  message: string;
  post: Post;
}

export interface GetAllActivePostsResponse {
  message: string;
  posts: PaginatedPosts;
}

export interface GetAllNonActivePostsResponse {
  message: string;
  posts: Post[];
}

export interface GetPostResponse {
  message: string;
  post: Post;
}

export interface LikeUnlikePostResponse {
  success: true;
  message: string;
  post: Post;
}
