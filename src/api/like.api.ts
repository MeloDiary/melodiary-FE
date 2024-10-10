import { ILikedUser } from '../models/user.model';
import { httpClient } from './http';

export const getLikes = async (diaryId: number): Promise<ILikedUser[]> => {
  const response = await httpClient.get<ILikedUser[]>(`/api/diaries/${diaryId}/like`);
  return response.data;
};

export const postLike = async (diaryId: number, userId: number) => {
  const response = await httpClient.post(`/api/diaries/${diaryId}/like`, { userId });
  return response.data;
};
  
export const deleteLike = async (diaryId: number, userId: number) => {
  const response = await httpClient.delete(`/api/diaries/${diaryId}/like`, { data: { userId } });
  return response.data;
};