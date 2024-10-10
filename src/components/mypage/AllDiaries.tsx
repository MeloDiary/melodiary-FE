import styled from 'styled-components';
import DiaryCard from './DiaryCard';
import { useMyPage } from '../../hooks/useMyPage';
import { useEffect, useCallback } from 'react';

const AllDiaries = () => {
  const { fetchAllDiariesData, userDiaries, page, setPage, more } = useMyPage();

  const handleScroll = useCallback(() => {
    // 현재 스크롤 위치 + 화면 높이 >= 전체 문서 높이
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight && more) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [more, setPage]);
  

  useEffect(() => {
    fetchAllDiariesData(); // 페이지가 변경될 때마다 데이터 요청
  }, [page]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  if (!userDiaries || userDiaries.length === 0) {
    return <NoDiaries>작성된 일기가 없습니다.</NoDiaries>;
  }

  return (
    <AllDiariesWrapper>
      <DiaryBox>
        {userDiaries.map((diary) => (
          <DiaryCard
            key={diary.id}
            id={diary.id}
            created_at={diary.created_at}
            body={diary.body}
          />
        ))}
      </DiaryBox>
    </AllDiariesWrapper>
  );
};

export default AllDiaries;

const NoDiaries = styled.div`
  color: ${({ theme }) => theme.color.gray777};
  height: calc(100vh - 524px);
`;

const AllDiariesWrapper = styled.div`
  width: 1014px;
`;

const DiaryBox = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 100%;
`;
