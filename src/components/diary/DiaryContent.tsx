import React, { useState } from "react";
import styled from "styled-components";
import Slider from "react-slick";
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
  isMatesPage = false,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const stripHtmlTags = (htmlContent: string) => {
    const div = document.createElement("div");
    div.innerHTML = htmlContent;
    return div.textContent || div.innerText || "";
  };

  const extractAllImages = (htmlContent: string): string[] => {
    const div = document.createElement("div");
    div.innerHTML = htmlContent;
    const images = div.querySelectorAll("img");
    return Array.from(images).map((img) => img.src);
  };

  const getSummaryHtml = (htmlContent: string, maxLength: number) => {
    const div = document.createElement("div");
    div.innerHTML = htmlContent;

    const textContent = div.textContent || div.innerText || "";
    if (textContent.length <= maxLength) return htmlContent;

    const truncatedText = textContent.slice(0, maxLength) + " ...";
    div.innerHTML = div.innerHTML.replace(textContent, truncatedText);

    return div.innerHTML;
  };

  const tagColor: string = diary.body.background_color || "default";

  const imageUrls = extractAllImages(diary.body.content);

  const summaryHtml = isSummary && isMatesPage
    ? getSummaryHtml(stripHtmlTags(diary.body.content), 200)
    : stripHtmlTags(diary.body.content);

  const sliderSettings = {
    dots: imageUrls.length > 1, 
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    customPaging: (i: number) => (
      <DotWrapper onClick={(e) => e.stopPropagation()}>
        <Dot active={i === currentSlideIndex} />
      </DotWrapper>
    ),
    dotsClass: "slick-dots custom-dots",
    adaptiveHeight: true,
    centerMode: false, 
    centerPadding: '0px', 
    beforeChange: (current: number, next: number) => {
      setCurrentSlideIndex(next); 
    },
  };

  return (
    <ContentContainer isSummary={isSummary} isMatesPage={isMatesPage}>
      {isSummary && imageUrls.length > 0 && (
        <SliderContainer>
          {imageUrls.length > 1 ? (
            <Slider {...sliderSettings}>
              {imageUrls.map((url, index) => (
                <SlideImageWrapper key={index}>
                  <SummaryImage src={url} alt={`Diary Image ${index + 1}`} />
                </SlideImageWrapper>
              ))}
            </Slider>
          ) : (
            <SummaryImage src={imageUrls[0]} alt="Diary Image" />
          )}
        </SliderContainer>
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
  overflow: hidden;
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
  height: 450px; 
  object-fit: cover;
`;

const SlideImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;  
  width: 100%;  
`;

const SliderContainer = styled.div`
  width: 100%;  
  margin-bottom: 20px;
  
  .slick-list {
    overflow: hidden;  
  }

  .slick-slide {
    opacity: 0; 
    transition: opacity 0.5s ease;
  }

  .slick-active {
    opacity: 1;  
  }

  .slick-slider {
    max-width: 100%; 
  }

  .slick-track {
    display: flex;
    align-items: center;  
  }

  .slick-slide img {
    width: 100%;  
    height: 450px;  
    object-fit: cover;  
  }

  .slick-dots.custom-dots {
    bottom: -20px;
    display: flex !important;
    justify-content: center;

    li {
      width: 12px;
      height: 12px;
      margin: 0 5px;  

      button {
        width: 100%;
        height: 100%;
        padding: 0;
        border-radius: 50%;
        background: transparent;
        border: 2px solid #ddd;

        &::before {
          content: "";
          width: 100%;
          height: 100%;
          background-color: #ddd;
          border-radius: 50%;
          display: block;
          opacity: 0.5;
        }
      }

      &.slick-active button {
        background-color: #333;
        border-color: #333;

        &::before {
          background-color: #333;
          opacity: 1;
        }
      }
    }
  }
`;

const DotWrapper = styled.div`
  display: inline-block;
`;

const Dot = styled.div<{ active: boolean }>`
  width: 10px;
  height: 10px;
  background-color: ${({ active }) => (active ? "#333" : "#ddd")};
  border-radius: 50%;
  margin: 0 5px;
`;
