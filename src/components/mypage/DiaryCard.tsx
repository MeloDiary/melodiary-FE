import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { IDiary } from '../../models/diary.model';

type DiaryCardProps = Pick<IDiary, 'id' | 'created_at' | 'body'>;

export const handleFormatDate = (created_at: string) => {
  const date = new Date(created_at.split('T')[0]);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  };
  return new Intl.DateTimeFormat('ko-KR', options).format(date);
};

const handleScriptHtml = (htmlContent: string) => {
  const div = document.createElement("div.content");
  div.innerHTML = htmlContent;
  return div.innerText;
};

const DiaryCard = ({
  id,
  created_at,
  body,
}: DiaryCardProps) => {
  const navigate = useNavigate();

  const handleDiaryClick = () => {
    navigate(`/diary/${id}`);
  };


  return (
    <DiaryCardWrapper
      bgColor={body.background_color ?? "default"}
      onClick={handleDiaryClick}
    >
      <DiaryDate>{handleFormatDate(created_at ?? "")}</DiaryDate>
      <DiaryTitle>{body.title}</DiaryTitle>
      <DiaryTagBox bgColor={body.background_color ?? "default"}>
        <div className="weather">날씨 | {body.weather?.avg_temperature} °C</div>
        <div className="mood">기분 | {body.emoji}</div>
        <div className="emoji">오늘의 이모지 | {body.mood}</div>
      </DiaryTagBox>
      <DiaryContent>{handleScriptHtml(body.content)}</DiaryContent>
    </DiaryCardWrapper>
  );
};

export default DiaryCard;

const DiaryCardWrapper = styled.div<{ bgColor: string }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  height: 220px;
  padding: 24px 20px;
  background-color: ${({ theme, bgColor }) => theme.diaryColor[bgColor].background};
  border: 1px solid ${({ theme }) => theme.color.grayDF};
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
`;

const DiaryDate = styled.div`
  font-family: ${({ theme }) => theme.fontFamily.kor};
  font-size: ${({ theme }) => theme.text.text3};
`;

const DiaryTitle = styled.div`
  margin-bottom: 4px;
  font-family: ${({ theme }) => theme.fontFamily.kor};
  font-size: ${({ theme }) => theme.title.title4};
  font-weight: 600;
`;

const DiaryTagBox = styled.div<{ bgColor: string }>`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;

  div {
    font-size: ${({ theme }) => theme.text.text3};
    color: ${({ theme }) => theme.color.gray};
    background-color: ${({ theme, bgColor }) => theme.diaryColor[bgColor].tag};
    padding: 4px 10px;
    border-radius: 30px;
  }
`;

const DiaryContent = styled.div`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  line-height: 24px;
  font-family: ${({ theme }) => theme.fontFamily.kor};
  font-size: ${({ theme }) => theme.text.text3};
`;
