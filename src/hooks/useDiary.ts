import { useState, useEffect } from "react";
import { fetchWriteDiary, fetchDiaryById, fetchPutDiary, fetchDeleteDiary } from "../api/diary.api";
import { IDiary } from "../models/diary.model";
import { useNavigate } from "react-router-dom";

export const useDiaries = () => {
  const [diaryBody, setDiaryBody] = useState<IDiary["body"] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [wirteDiaryErr, setWriteDiaryErr] = useState<string | null>(null);

  // 작성한 일기 저장
  const saveDiary = async (data: IDiary["body"]) => {
    setLoading(true);
    try {
      await fetchWriteDiary(data);
      setDiaryBody(data);
    } catch (err) {
      setWriteDiaryErr("일기 저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };
  
  return { diaryBody, loading, wirteDiaryErr, saveDiary };
};

export const useDiary = (diaryId: number) => {
  const [diary, setDiary] = useState<IDiary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null); 

  useEffect(() => {
    const getDiary = async () => {
      try {
        const diaryData = await fetchDiaryById(diaryId);
        setDiary(diaryData);
      } catch (error) {
        console.error('Failed to fetch diary', error);
      } finally {
        setLoading(false);
      }
    };

    getDiary();
  }, [diaryId]);

  return { diary, loading, error }; 
};


export const useUpdateDiary = () => {
  const [error, setError] = useState<string | null>(null);
  const [updatedDiary, setUpdatedDiary] = useState<IDiary | null>(null);
  
  const updateDiary = async (diaryId: number, data: IDiary["body"]) => {
    setError(null);
    try {
      const response = await fetchPutDiary(diaryId, data);
      setUpdatedDiary(response);
    } catch (err) {
      setError("일기 수정에 실패했습니다.");
    }
  };

  return { updateDiary, error, updatedDiary };
};


export const useDeleteDiary = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteDiary = async (diaryId: number) => {
    setLoading(true);
    setError(null);
    try {
      await fetchDeleteDiary(diaryId);
    } catch (err) {
      setError("일기 삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return { deleteDiary, loading, error };
};
