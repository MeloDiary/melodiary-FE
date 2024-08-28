import React, { useEffect, useState } from "react";
import styled from "styled-components";
import DiaryItem from "../components/diary/DiaryItem";
import MatesSidebar from "../components/sidebar/MatesSidebar";
import { useMatesData } from "../hooks/useMatesData";
import { IDiary } from "../models/diary.model";
import { useDeleteMate } from "../hooks/useMates";

function Mates() {
  const userId = localStorage.getItem("user_id");
  const numericUserId = userId ? parseInt(userId, 10) : 0; // undefined일 경우 0으로 설정

  const { diaries, loading, error, setDiaries } = useMatesData(numericUserId);

  const { handleDeleteMate } = useDeleteMate(numericUserId, () => {
    setDiaries((prevDiaries) => prevDiaries.filter(diary => diary.user_profile.user_id !== numericUserId));
  });

  if (numericUserId === 0) {
    return <div>Error: No valid user ID found. Please log in.</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <MatesWrapper>
      <MatesSidebar />
      <MatesFeed>
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
      </MatesFeed>
    </MatesWrapper>
  );
}


const MatesWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 30px;
`;

const MatesFeed = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; 
  justify-content: flex-start; 
  width: 100%; 
  padding: 20px;
  margin-bottom: 30px;
`;

const DiaryItemWrapper = styled.div`
  margin-bottom: 20px; 
  width: 100%; 
  max-width: 800px;
`;

export default Mates;
