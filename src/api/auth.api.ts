import axios, { AxiosResponse } from 'axios';
import { INicknameRequest, ISignup } from '../models/user.model';
import { httpClient } from './http';

// 회원가입
export const signUp = async (data: ISignup): Promise<AxiosResponse<{ access_token: string; refresh_token: string; user_id: any }>> => {
  const response = await httpClient.post(`api/users`, data, {
    withCredentials: true,
  });
  return response;
  
};

// 로그인
export const login = async (data: ISignup): Promise<AxiosResponse<{ access_token: string; refresh_token: string; user_id: any }>>  => {
  const response = await httpClient.post(`/api/users/login`, data, {
    withCredentials: true,
  });
  return response;
};

// 로그아웃
export const logout = async (userId : string): Promise<AxiosResponse<any>>  => {
  const response = await httpClient.post(`/api/users/${userId}/logout`, null, {
    withCredentials: true,
  });
  return response;
};


// 최초 닉네임 등록
export const registerNickname = async (id: string, nickname: string): Promise<AxiosResponse<any>> => {
  const data: INicknameRequest = { nickname };
  const response = await httpClient.post(`/api/users/${id}/nickname`, data, {
    withCredentials: true,
  });

  return response;
};
