import { ErrorResponse } from "../errorModel";

export interface signupUserSuccessResponse {
  token: string;
  }

export interface signupUserRequest {
  name: string;
  email: string;
  password: string;
}
  
export type signupUserApiResponse = signupUserSuccessResponse | ErrorResponse;

export interface iconUploadSuccessResponse {
  iconUrl: string;
}

export interface iconUploadRequest {
  token: string;
  icon: File | null;
}

export type iconUploadApiResponse = iconUploadSuccessResponse | ErrorResponse;