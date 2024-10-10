import { IDiary } from "../models/diary.model";
import { httpClient } from "./http";

export const fetchExploreDiaries = async (page: number, limit: number = 10): Promise<IDiary[]> => {
  const response = await httpClient.get<IDiary[]>('/api/diaries/explore', {
    params: { page, limit }
  });
  return response.data;
};
