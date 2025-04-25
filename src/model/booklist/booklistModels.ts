import { errorResponse } from "../errorModel"

// Get booklist data models
export interface booklistSuccessResponse {
    id: string;
    title: string;
    url: string;
    detail: string;
    review: string;
    reviewer: string;
    isMine: boolean;
  }

export interface booklistRequest {
  token: string,
  offset: string,
}

export type booklistResponse = booklistSuccessResponse[];

export type booklistApiResponse = booklistResponse | errorResponse;


// Post book review date models

export interface bookPostRequest {
  title: string;
  url: string;
  detail: string;
  review: string;
}

export interface bookPostResponse {
  message: string;
}

export type bookPostApiResponse = bookPostResponse | errorResponse;
