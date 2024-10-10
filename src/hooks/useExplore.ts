import { useState, useEffect } from 'react';
import { IDiary } from '../models/diary.model';
import { fetchExploreDiaries } from '../api/explore.api';

export const useExploreData = () => {
  const [diaries, setDiaries] = useState<IDiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newDiaries = await fetchExploreDiaries(page);
        setDiaries(prevDiaries => [...prevDiaries, ...newDiaries]);
        if (newDiaries.length === 0) {
          setHasMore(false);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  return { diaries, loading, error, setDiaries, setPage, hasMore };
};
