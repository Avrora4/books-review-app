import { ErrorResponse } from "../errorModel"

// Get booklist data models
export interface BooklistSuccessResponse {
    id: string;
    title: string;
    url: string;
    detail: string;
    review: string;
    reviewer: string;
    isMine: boolean;
  }

export interface BooklistRequest {
  token: string,
  offset: string,
}

export type BooklistResponse = BooklistSuccessResponse[];

export type BooklistApiResponse = BooklistResponse | ErrorResponse;


// Post book review date models

export interface BookPostRequest {
  title: string;
  url: string;
  detail: string;
  review: string;
}

export interface BookPostResponse {
  message: string;
}

export type BookPostApiResponse = BookPostResponse | ErrorResponse;

export interface GetBookDetailRequest {
  id: string;
}
export interface GetBookDetailResponse {
  id: string;
  title: string;
  url: string;
  detail: string;
  review: string;
  reviewer: string;
  isMine: boolean;
}

export type GetBookDetailApiResponse = GetBookDetailResponse | ErrorResponse;

// 方定義については、大文字の方が良い
// ファイル名については、-を使用する方が良いかも、、(git管理の場合)
// method(関数)レベルでは小文字で問題ない