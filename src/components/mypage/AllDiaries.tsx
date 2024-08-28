import styled from 'styled-components';
import DiaryCard from './DiaryCard';
import { useMyPage } from '../../hooks/useMyPage';

const AllDiaries = () => {
  const { userDiaries } = useMyPage();

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
