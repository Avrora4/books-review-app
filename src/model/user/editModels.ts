import { errorResponse } from "../errorModel";

export interface getLoginInfoResponse {
    name: string
    iconUrl: string
}

export interface getLoginInfoRequest {
    token: string
  }

export type getLoginInfoApiResponse = getLoginInfoResponse | errorResponse;