import axios, { AxiosResponse } from 'axios';
import { httpClient } from './http';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const requestMate = async (userId : string, mateId: string): Promise<AxiosResponse<any>>  => {
  const requsetData = {
      mate_id: mateId
  }
  const response = await httpClient.post(`/api/users/${userId}/mates`, requsetData, {
    withCredentials: true,
  });
  return response;
};

export const requestMateList = async (userId : string): Promise<AxiosResponse<any>>  => {
  const response = await httpClient.get(`/api/users/${userId}/mates/requests/sent`, {
    withCredentials: true,
  });
  return response;
};

