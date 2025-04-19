import axios from "axios";
import { apiUrl } from "../../const";
import { booklistResponse, booklistApiResponse, booklistRequest } from "../../model/booklist/booklistModels";
import { errorResponse } from "../../model/errorModel"

const API_BASE_URL = `${apiUrl}`;

export const booklistAPI  = async (booklistRequestData: booklistRequest) : Promise<booklistApiResponse> => {
    const response = await axios.get(
        `${API_BASE_URL}/public/books?offset=${booklistRequestData.offset}`,
        {
        method: 'GET',
        headers: {
          // "Authorization": booklistRequestData.token,
          'Content-Type': 'application/json',
        },
    });
    if (response.status === 200 ) {
        return response.data as booklistResponse;
    } else {
        return response.data as errorResponse;
    }
}

// pagesフォルダ
// 正式なものはない
// バックエンドを変更した際に、分けておくと便利
// ドメイン駆動開発 DmainDrivenDevelopment