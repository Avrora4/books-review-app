import axios from "axios";
import { apiUrl } from "../../const";
import { signupUserApiResponse, signupUserRequest, signupUserSuccessResponse, iconUploadApiResponse, iconUploadRequest, iconUploadSuccessResponse } from "../../model/user/signupModels";
import { loginApiResponse, loginRequest, loginSuccessResponse } from "../../model/user/loginModels";
import { errorResponse } from "../../model/errorModel";

const API_BASE_URL = `${apiUrl}`

export const signupUserAPI  = async (userData: signupUserRequest) : Promise<signupUserApiResponse> => {
    const response = await axios.post<signupUserApiResponse>(
        `${API_BASE_URL}/users`,
        userData,
        {
        headers: {
            'Content-Type': 'application/json', 
        },
    });
    if (response.status === 200 ) {
        return response.data as signupUserSuccessResponse;
    } else {
        return response.data as errorResponse;
    }
}

export const iconUploadAPI = async (iconData: iconUploadRequest) : Promise<iconUploadApiResponse> => {
    const response = await axios.post<iconUploadApiResponse>(
        `${API_BASE_URL}/users`,
        iconData,
        {
        headers: {
            'Content-Type': 'application/json', 
        },
    });
    if (response.status === 200 ) {
        return response.data as iconUploadSuccessResponse;
    } else {
        return response.data as errorResponse;
    }
}

export const loginAPI = async (loginData: loginRequest) : Promise<loginApiResponse> => {
    const response = await axios.post<loginApiResponse>(
        `${API_BASE_URL}/signin`,
        loginData,
        {
            headers: {
                'Content-Type': 'application/json',
            },
    });
    if (response.status === 200 ) {
        return response.data as loginSuccessResponse;
    } else {
        return response.data as errorResponse;
    } 
}