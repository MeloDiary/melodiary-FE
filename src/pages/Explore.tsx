import React, { useState } from "react";
import styled from "styled-components";
import DiaryItem from "../components/diary/DiaryItem";
import { useExploreData } from "../hooks/useExplore";

function Explore() {
  const { diaries, loading, error } = useExploreData();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <ExploreWrapper>
      {diaries.map((diary) => (
        <DiaryItemWrapper key={diary.id}>
          <DiaryItem
            diary={diary}
            user={diary.user_profile}
            likedUsers={[]}
            isSummary={true}
          />
        </DiaryItemWrapper>
      ))}
    </ExploreWrapper>
  );
}


const ExploreWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin-bottom: 30px;
`;

const DiaryItemWrapper = styled.div`
  margin-bottom: 20px; 
  width: 100%; 
  max-width: 850px; 
`;

export default Explore;
