import { IComment } from "../models/comment.model";
import { httpClient } from "./http";

export const fetchComments = async (diary_id: number): Promise<IComment[]> => {
  const response = await httpClient.get(`/api/diaries/${diary_id}/comments`);
  return response.data;
};

export const postComment = async (
  diary_id: number,
  content: string,
  mentioned_user_id?: number | null
): Promise<IComment> => {
  const response = await httpClient.post(`/api/diaries/${diary_id}/comments`, {
    content,
    mentioned_user_id,
  });
  return response.data;
};

export const updateComment = async (
  diary_id: number,
  comment_id: number,
  content: string
): Promise<IComment> => {
  const response = await httpClient.put(
    `/api/diaries/${diary_id}/comments/${comment_id}`,
    { content }
  );
  return response.data;
};

export const deleteComment = async (
  diary_id: number,
  comment_id: number
): Promise<void> => {
  await httpClient.delete(`/api/diaries/${diary_id}/comments/${comment_id}`);
};
