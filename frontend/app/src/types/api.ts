export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data?: T;
  [key: string]: unknown;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  [key: string]: unknown;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface ApiErrorShape {
  message: string;
  statusCode?: number;
}
