import { ErrorResponse } from "../errorModel";

export interface getLoginInfoResponse {
    name: string
    iconUrl: string
};

export interface getLoginInfoRequest {
    token: string
};

export type getLoginInfoApiResponse = getLoginInfoResponse | ErrorResponse;


export interface updateUserInfoRequest {
  token: string;
  name: string;
};

export interface updateUserInfoResponse extends getLoginInfoResponse {
    name: string;
};

export type updateUserInfoApiResponse = updateUserInfoResponse | ErrorResponse;