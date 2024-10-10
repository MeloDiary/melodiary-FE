import React, { useEffect } from "react";
import styled from "styled-components";
import DiaryItem from "../components/diary/DiaryItem";
import MatesSidebar from "../components/sidebar/MatesSidebar";
import { useMatesData } from "../hooks/useMatesData";

const Mates = () => {
  const userId = localStorage.getItem("user_id");
  const numericUserId = userId ? parseInt(userId, 10) : 0;
  const { diaries, loading, error, setDiaries, setPage, hasMore } = useMatesData(numericUserId);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500 && hasMore && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  if (numericUserId === 0) {
    return <div>Error: No valid user ID found. Please log in.</div>;
  }

  if (loading && diaries.length === 0) {
    return (
      <LoadingMessage>
        <Spinner />
        <LoadingText>Loading...</LoadingText>
      </LoadingMessage>
    );
  }
  
  if (error) {
    throw new Error("네트워크 오류 발생: " + error.message);
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
        {loading && <Spinner />}
      </MatesFeed>
    </MatesWrapper>
  );
};

export default Mates;

const LoadingMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const LoadingText = styled.div`
  margin-top: 10px;
  font-size: 16px;
  color: #333;
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #000;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const MatesWrapper = styled.div`
  display: flex;
`;

const MatesFeed = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; 
  justify-content: center;
  padding: 50px;
  margin-bottom: 30px;
  width: 100%; 
`;

const DiaryItemWrapper = styled.div`
  margin-bottom: 20px; 
  width: 100%;
  max-width: 850px;
  box-sizing: border-box; 
  display: flex;
  justify-content: center;
`;
