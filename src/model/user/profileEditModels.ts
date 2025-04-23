import { errorResponse } from "../errorModel";

export interface getLoginInfoResponse {
    name: string
    iconUrl: string
};

export interface getLoginInfoRequest {
    token: string
};

export type getLoginInfoApiResponse = getLoginInfoResponse | errorResponse;


export interface updateUserInfoRequest {
  token: string;
  name: string;
};

export interface updateUserInfoResponse extends getLoginInfoResponse {
    name: string;
};

export type updateUserInfoApiResponse = updateUserInfoResponse | errorResponse;