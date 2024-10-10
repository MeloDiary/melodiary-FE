import React from "react";
import { useParams } from "react-router-dom";
import DiaryItem from "../components/diary/DiaryItem";
import MusicBar from "../components/musicbar/MusicBar";
import { useDiary } from "../hooks/useDiary";
import styled from "styled-components";

function Diary() {
  const { diaryId } = useParams<{ diaryId: string }>();
  const numericDiaryId = diaryId ? Number(diaryId) : null;

  const { diary, loading: diaryLoading, error } = useDiary(numericDiaryId!);

  if (diaryLoading) {
    return <p>Loading...</p>;
  }
  
  if (error || !diary) {
    const errorMessage = error ? error.message : "Unknown error";
    throw new Error("네트워크 오류 발생: " + errorMessage);
  }
  
  return (
    <DiaryContainer backgroundColor={diary.body.background_color || undefined}>
      <DiaryItem
        diary={diary}
        user={diary.user_profile}
        likedUsers={[]}
        isExpanded={true}
      />
      {diary.body.music && (
        <MusicBar
          youtubeUrl={diary.body.music.music_url}
          title={diary.body.music.title}
          artist={diary.body.music.artist}
          isExpanded={true}
        />
      )}
    </DiaryContainer>
  );
}

export default Diary;

const DiaryContainer = styled.div<{ backgroundColor?: string }>`
  background-color: ${({ backgroundColor, theme }) =>
    backgroundColor
      ? theme.diaryColor[backgroundColor]?.background
      : theme.color.highlight};
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;
