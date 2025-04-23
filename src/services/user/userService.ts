import axios from "axios";
import { apiUrl } from "../../const";
import { signupUserApiResponse, signupUserRequest, signupUserSuccessResponse, iconUploadApiResponse, iconUploadRequest, iconUploadSuccessResponse } from "../../model/user/signupModels";
import { loginApiResponse, loginRequest, loginSuccessResponse } from "../../model/user/loginModels";
import { errorResponse } from "../../model/errorModel";
import { getLoginInfoApiResponse, getLoginInfoRequest, getLoginInfoResponse, updateUserInfoApiResponse, updateUserInfoRequest, updateUserInfoResponse } from "../../model/user/profileEditModels";

const API_BASE_URL = `${apiUrl}`;

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
        console.log(response.data);
        return response.data as signupUserSuccessResponse;
    } else {
        return response.data as errorResponse;
    }
};

export const iconUploadAPI = async (iconData: iconUploadRequest) : Promise<iconUploadApiResponse> => {
    const formData = new FormData();
    if (iconData.icon) {
        formData.append('icon', iconData.icon, iconData.icon.name);
    }
    const response = await axios.post<iconUploadApiResponse>(
        `${API_BASE_URL}/uploads`,
        formData,
        {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${iconData.token}`,
        },
    });
    if (response.status === 200 ) {
        return response.data as iconUploadSuccessResponse;
    } else {
        return response.data as errorResponse;
    }
};

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
};

export const getLoginInfoAPI = async (getLoginInfoData: getLoginInfoRequest) : Promise<getLoginInfoApiResponse> => {
    const response = await axios.get<getLoginInfoApiResponse>(
        `${API_BASE_URL}/users`,
        {
            method: 'GET',
            headers: {
                'Authorization': getLoginInfoData.token,
                'Content-Type': 'application/json',
            },
    });
    if (response.status === 200 ) {
        return response.data as getLoginInfoResponse;
    } else {
        return response.data as errorResponse;
    } 
};

export const updateUserInfoAPI = async ( updateUserInfoData: updateUserInfoRequest) : Promise<updateUserInfoApiResponse> => {
    const response = await axios.put<updateUserInfoApiResponse>(
        `${API_BASE_URL}/users`,
        updateUserInfoData,
        {
            headers: {
                'Authorization': `${updateUserInfoData.token}`,
                'Content-Type': 'application/json',
                'accept': 'application/json',
            },
    });
    if (response.status === 200 ) {
        return response.data as updateUserInfoResponse;
    } else {
        return response.data as errorResponse;
    } 
};