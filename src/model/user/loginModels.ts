import { errorResponse } from "../errorModel";

export interface loginSuccessResponse {
    token: string
}

export interface loginRequest {
    email: string,
    password: string
  }

export type loginApiResponse = loginSuccessResponse | errorResponse;
