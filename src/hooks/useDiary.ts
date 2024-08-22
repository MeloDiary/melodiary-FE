import { useState, useEffect } from "react";
import { fetchWriteDiary, fetchDiaryById } from "../api/diary.api";
import { IDiary } from "../models/diary.model";

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
      console.log(data);
    } catch (err) {
      setWriteDiaryErr("일기 저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };
  
  return {
    diaryBody,
    saveDiary,
    loading,
    wirteDiaryErr,
  };
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
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    getDiary();
  }, [diaryId]);

  return { diary, loading, error }; 
};
