import { useState, useEffect } from "react";
import { IComment } from "../models/comment.model";
import {
  fetchComments,
  postComment,
  updateComment,
  deleteComment,
} from "../api/comment.api";

export const useComments = (diaryId: number) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true);
        const data = await fetchComments(diaryId); 
        const sortedData = data.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        setComments(sortedData);
      } catch (error) {
        setError("Failed to load comments.");
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [diaryId]);

  const addComment = async (
    content: string,
    mentioned_user_id?: number | null
  ) => {
    try {
      const newComment = await postComment(diaryId, content, mentioned_user_id);
      if (newComment) { 
        setComments((prevComments) => [
          ...prevComments, 
          newComment       
        ]);
      }
    } catch (error) {
      setError("Failed to add comment.");
    }
  };

  const editComment = async (comment_id: number, content: string) => {
    try {
      const updatedComment = await updateComment(diaryId, comment_id, content);
      if (updatedComment) { 
        setComments((prevComments) => {
          const updatedComments = prevComments.map((comment) =>
            comment.comment_id === comment_id ? updatedComment : comment
          );
          return updatedComments.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        });
      }
    } catch (error) {
      setError("Failed to edit comment.");
    }
  };

  const removeComment = async (comment_id: number) => {
    try {
      await deleteComment(diaryId, comment_id);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.comment_id !== comment_id)
      );
    } catch (error) {
      setError("Failed to delete comment.");
    }
  };

  return {
    comments,
    setComments,
    loading,
    error,
    addComment,
    editComment,
    removeComment,
  };
};
