import React from "react";
import styled from "styled-components";
import { IDiary } from "../../models/diary.model";

interface DiaryContentProps {
  diary: IDiary;
  isSummary?: boolean;
  isExpanded?: boolean;
  isMatesPage?: boolean;
}

const DiaryContent: React.FC<DiaryContentProps> = ({
  diary,
  isSummary = false,
  isExpanded = false,
  isMatesPage = false
}) => {

  const stripHtmlTags = (htmlContent: string) => {
    const div = document.createElement('div');
    div.innerHTML = htmlContent;
    return div.textContent || div.innerText || "";
  };

  const extractFirstImage = (htmlContent: string): string | null => {
    const div = document.createElement('div');
    div.innerHTML = htmlContent;
    const img = div.querySelector('img');
    return img ? img.src : null;
  };

  const getSummaryHtml = (htmlContent: string, maxLength: number) => {
    const div = document.createElement('div');
    div.innerHTML = htmlContent;

    const textContent = div.textContent || div.innerText || "";
    if (textContent.length <= maxLength) return htmlContent;

    const truncatedText = textContent.slice(0, maxLength) + " ...";
    div.innerHTML = div.innerHTML.replace(textContent, truncatedText);

    return div.innerHTML;
  };

  const tagColor: string = diary.body.background_color || "default";

  const firstImageUrl = extractFirstImage(diary.body.content);

  const summaryHtml = isSummary && isMatesPage
    ? getSummaryHtml(stripHtmlTags(diary.body.content), 200)
    : stripHtmlTags(diary.body.content);

  return (
    <ContentContainer isSummary={isSummary} isMatesPage={isMatesPage}>
      {isSummary && firstImageUrl && (
        <SummaryImage src={firstImageUrl} alt={diary.body.title} />
      )}
      <Title>
        {isSummary && (
          <Right>
            <DiaryTitle isSummary={isSummary} isMatesPage={isMatesPage}>
              {diary.body.title}
            </DiaryTitle>
          </Right>
        )}
      </Title>
      <DiaryTag tagColor={tagColor} isSummary={isSummary} isMatesPage={isMatesPage}>
        {diary.body.emoji && (
          <DiaryTagItem tagColor={tagColor} isSummary={isSummary} isMatesPage={isMatesPage}>
            오늘의 이모지 | {diary.body.emoji}
          </DiaryTagItem>
        )}
        <DiaryTagItem tagColor={tagColor} isSummary={isSummary} isMatesPage={isMatesPage}>
          기분 | {diary.body.mood}
        </DiaryTagItem>
        {diary.body.weather && (
          <DiaryTagItem tagColor={tagColor} isSummary={isSummary} isMatesPage={isMatesPage}>
            위치 | {diary.body.weather.location}
          </DiaryTagItem>
        )}
        {diary.body.weather && (
          <DiaryTagItem tagColor={tagColor} isSummary={isSummary} isMatesPage={isMatesPage}>
            날씨 | {diary.body.weather.icon} {diary.body.weather.avg_temperature}°C
          </DiaryTagItem>
        )}
        {diary.body.music && (
          <DiaryTagItem tagColor={tagColor} isSummary={isSummary} isMatesPage={isMatesPage}>
            오늘의 선곡 | {diary.body.music.title} - {diary.body.music.artist}
          </DiaryTagItem>
        )}
      </DiaryTag>

      <DiaryText isExpanded={isExpanded} isSummary={isSummary} isMatesPage={isMatesPage}>
        <div
          dangerouslySetInnerHTML={{
            __html: isSummary ? summaryHtml : diary.body.content,
          }}
        />
      </DiaryText>
    </ContentContainer>
  );
};

export default DiaryContent;

const ContentContainer = styled.div<{ isSummary: boolean; isMatesPage: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  padding: ${({ isSummary, isMatesPage }) => (isSummary || isMatesPage ? "0 5%" : "0 10%")};
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
`;

const Right = styled.div`
  display: flex;
  gap: 5px;
  align-items: start;
  justify-content: start;
`;

const DiaryTitle = styled.h2<{ isSummary: boolean; isMatesPage: boolean }>`
  margin: 0;
  margin: ${({ isSummary, isMatesPage }) => (isSummary || isMatesPage ? "0 0 10px 0" : "10px 0")};
  justify-content: start;
  font-size: ${({ theme }) => theme.title.title3};
  font-weight: 600;
  color: ${({ theme }) => theme.color.black};
`;

const DiaryTag = styled.div<{ tagColor: string; isSummary: boolean; isMatesPage: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  padding: 10px 0;
  border-top: ${({ isSummary, isMatesPage, theme }) =>
    isSummary || isMatesPage ? "none" : `1px solid ${theme.color.grayDF}`};
  border-bottom: ${({ isSummary, isMatesPage, theme }) =>
    isSummary || isMatesPage ? "none" : `1px solid ${theme.color.grayDF}`};
`;

const DiaryTagItem = styled.div<{ tagColor: string; isSummary: boolean; isMatesPage: boolean }>`
  display: flex;
  align-items: center;
  padding: 5px 15px;
  white-space: nowrap;
  border-radius: 20px;
  background-color: ${({ theme, tagColor }) =>
    theme.diaryColor[tagColor]?.tag || theme.diaryColor.default.tag};
  font-size: ${({ theme }) => theme.text.text3};
`;

const DiaryText = styled.div<{ isExpanded: boolean; isSummary: boolean; isMatesPage: boolean }>`
  width: 100%;
  max-width: 100%;
  padding: ${({ isSummary, isMatesPage }) => (isSummary || isMatesPage ? "10px 0 10px 0" : "30px 0 30px 0")};
  font-size: ${({ theme }) => theme.text.text1};
  color: ${({ theme }) => theme.color.grayblack};
  white-space: pre-line;
`;

const SummaryImage = styled.img`
  width: 100%;
  max-height: 450px;
  object-fit: cover;
  margin-bottom: 20px;
`;
