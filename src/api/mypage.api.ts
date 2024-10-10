import { httpClient } from "./http";
import { IDiary } from "../models/diary.model";
import { IUserProfile } from "../models/mypage.model";

// 사용자 정보 조회 api
export const fetchUserProfile = async (userId: number) => {
  const response = await httpClient.get<IUserProfile>(`/api/users/${userId}`);

  return response.data;
};

// 전체 일기 조회 api
export const fetchAllDiaries = async (page: number, limit: number) => {
  const response = await httpClient.get<IDiary[]>("/api/diaries/myposts", {
    params: { page, limit }
  });

  return response.data;
};

// 닉네임 중복 확인 api
export const fetchCheckNickname = async (nickName: string) => {
  const response = await httpClient.get(`/api/users/nicknames?nickname=${nickName}`);

  return response.data;
};

// 닉네임 수정 api
export const fetchChangeNickname = async (userId: number, nickName: string) => {
  const response = await httpClient.put(`/api/users/${userId}/nickname`, {
    nickname: nickName
  });

  return response.data;
};

// 회원 탈퇴 api
export const fetchDeleteAccount = async (userId: number) => {
  const response = await httpClient.delete(`/api/users/${userId}`);

  return response.data;
};

// 기분 그래프 조회 api
export const fetchMoodGraph = async (date: string) => {
  const response = await httpClient.get(`/api/diaries/mymoods?month=${date}`);

  return response.data;
};