import { httpClient } from "./http";
import { IDiary } from "../models/diary.model";
import { IUserProfile } from "../models/mypage.model";

// 사용자 정보 조회 api
export const fetchUserProfile = async (userId: number) => {
  const response = await httpClient.get<IUserProfile>(`/api/users/${userId}`);
  console.log(response.data);

  return response.data;
};

// 전체 일기 조회 api
export const fetchAllDiaries = async () => {
  const response = await httpClient.get<IDiary[]>("/api/diaries/myposts");

  return response.data;
};