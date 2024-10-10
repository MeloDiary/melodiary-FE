import { IDiary } from "../models/diary.model";
import { httpClient } from "./http";

// 친구 피드 API 호출
export const fetchMateFeeds = async (page: number, limit: number = 5): Promise<IDiary[]> => {
  const response = await httpClient.get<IDiary[]>("/api/diaries/mates", {
    params: {
      page,
      limit,
    },
  });
  return response.data;
};

// 받은 친구 요청 목록을 가져오는 API 호출
export const fetchReceivedMateRequests = async (user_id: number) => {
  const response = await httpClient.get(
    `/api/users/${user_id}/mates/requests/received`
  );
  return response.data;
};

// 친구 요청을 수락하는 API 호출
export const acceptMateRequest = async (user_id: number, requestID: number) => {
  const response = await httpClient.put(
    `/api/users/${user_id}/mates/requests/${requestID}`
  );
  return response.data;
};

// 친구 요청을 거절하는 API 호출
export const rejectMateRequest = async (user_id: number, requestID: number) => {
  const response = await httpClient.delete(
    `/api/users/${user_id}/mates/requests/${requestID}`
  );
  return response.data;
};

// 친구 목록을 가져오는 API 호출
export const fetchMatesList = async (user_id: number) => {
  const response = await httpClient.get(`/api/users/${user_id}/mates`);
  return response.data;
};

export const deleteMate = async (user_id: number, mate_id: number) => {
  const response = await httpClient.delete(
    `/api/users/${user_id}/mates/${mate_id}`, {
      withCredentials: true,
    });
  return response.data;
};
