import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useAuth } from '../context/AuthContext'; 
import { logoutUtility } from '../util/logoutUtility'; 
import { useState } from "react";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const DEFAULT_TIMEOUT = 10000 * 60;

// Access Token 가져오기
const getAccessToken = () => localStorage.getItem('access_token');

// Refresh Token으로 Access Token 재발급 함수
const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) throw new Error('No refresh token available');
  
  const response = await axios.post(`${BASE_URL}/api/users/${localStorage.getItem('user_id')}/token-refresh`, {
    refresh_token: refreshToken,
  }, {
    withCredentials: true,
  });

  const { access_token } = response.data;
  localStorage.setItem('access_token', access_token);
  return access_token;
};

export const createClient = (config?: AxiosRequestConfig) => {
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: DEFAULT_TIMEOUT,
    headers: {
      "content-type": "application/json",
      'Cache-Control': 'no-cache'
    },
    withCredentials: true,
    ...config
  });

  // 요청 인터셉터 추가
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = getAccessToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터 추가
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
      const originalRequest = error.config;
      // 401 에러 발생 시 토큰 재발급 시도
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          console.log("토큰 재발급");
          const newAccessToken = await refreshToken();
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed', refreshError);
          logoutUtility();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const httpClient = createClient();