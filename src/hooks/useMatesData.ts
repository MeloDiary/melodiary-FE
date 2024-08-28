import { useState, useEffect } from 'react';
import { IDiary } from '../models/diary.model';
import { fetchMateFeeds } from '../api/mates.api';

export const useMatesData = (userId: number | undefined) => {
  const [diaries, setDiaries] = useState<IDiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (userId === undefined) {
      setLoading(false);
      setError(new Error("No user ID provided"));
      return;
    }

    const fetchData = async () => {
      try {
        const mateFeeds = await fetchMateFeeds(); 
        setDiaries(mateFeeds);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return { diaries, loading, error, setDiaries };
};
