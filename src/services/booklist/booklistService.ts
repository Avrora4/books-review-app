import axios from "axios";
import { apiUrl } from "../../const";
import { BooklistResponse, BooklistApiResponse, BooklistRequest,
        BookPostResponse, BookPostApiResponse, BookPostRequest,
        GetBookDetailResponse, GetBookDetailApiResponse, GetBookDetailRequest
    } from "../../model/booklist/booklistModels";
import { ErrorResponse } from "../../model/errorModel"

const API_BASE_URL = `${apiUrl}`;

export const booklistAPI  = async (booklistRequestData: BooklistRequest) : Promise<BooklistApiResponse> => {
    const response = await axios.get(
        `${API_BASE_URL}/books?offset=${booklistRequestData.offset}`,
        {
        method: 'GET',
        headers: {
          "Authorization": booklistRequestData.token,
          'Content-Type': 'application/json',
        },
    });
    if (response.status === 200 ) {
        return response.data as BooklistResponse;
    } else {
        return response.data as ErrorResponse;
    }
}

export const bookReviewPostAPI = async (token: string, bookPostRequestData: BookPostRequest) : Promise<BookPostApiResponse> => {
    const response = await axios.post(
        `${API_BASE_URL}/books`,
        bookPostRequestData,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        }
    );
    if (response.status === 200 ) {
        return response.data as BookPostResponse;
    } else {
        return response.data as ErrorResponse;
    }
}

export const getBookDetailAPI = async (token: string, GetBookDetailRequestData: GetBookDetailRequest) : Promise<GetBookDetailApiResponse> => {
    const response = await axios.get(
        `${API_BASE_URL}/books/${GetBookDetailRequestData.id}`,
        {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
    });
    if (response.status === 200 ) {
        return response.data as GetBookDetailResponse;
    } else {
        return response.data as ErrorResponse;
    }
}

// pagesフォルダ
// 正式なものはない
// バックエンドを変更した際に、分けておくと便利
// ドメイン駆動開発 DmainDrivenDevelopment