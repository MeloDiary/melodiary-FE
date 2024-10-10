import { useState, useEffect } from 'react';
import { IDiary } from '../models/diary.model';
import { fetchMateFeeds } from '../api/mates.api';

export const useMatesData = (userId: number | undefined) => {
  const [diaries, setDiaries] = useState<IDiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (userId === undefined) {
      setLoading(false);
      setError(new Error("No user ID provided"));
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const mateFeeds = await fetchMateFeeds(page); 
        setDiaries((prevDiaries) => [...prevDiaries, ...mateFeeds]);
        setHasMore(mateFeeds.length > 0); 
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, page]);

  return { diaries, loading, error, setDiaries, setPage, hasMore };
};
