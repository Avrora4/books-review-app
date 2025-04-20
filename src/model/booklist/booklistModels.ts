import { errorResponse } from "../errorModel"

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
