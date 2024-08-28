import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DiaryItem from "../components/diary/DiaryItem";
import MusicBar from "../components/musicbar/MusicBar";
import Calendar from "../components/diary/Calender";
import PlayList from "../components/diary/PlayList";
import { useDiary } from "../hooks/useDiary";
import { useUserData } from "../hooks/useUserData";
import { motion } from "framer-motion";
import AddMateButton from "../components/button/AddMateButton";

interface LocationState {
  nickname?: string;
  profileImgUrl?: string;
  isExpanded?: boolean;
}

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();
  const location = useLocation();
  const user_id = localStorage.getItem("user_id");
  const [nickname, setNickname] = useState<string | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [calendarData, setCalendarData] = useState<any>(null);

  const state = location.state as LocationState | undefined;
  const [isExpanded, setIsExpanded] = useState(state?.isExpanded ?? false);

  const [selectedDiaryId, setSelectedDiaryId] = useState<number | null>(null);

  const { diary, loading: diaryLoading } = useDiary(selectedDiaryId || 0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (userId && user_id) {
      setIsOwnProfile(userId === user_id);
    }
  }, [userId, user_id]);

  useEffect(() => {
    if (state?.isExpanded !== undefined) {
      setIsExpanded(state.isExpanded);
    }
  }, [state?.isExpanded]);

  useEffect(() => {
    setSelectedDiaryId(null);
  }, [location.pathname, userId]);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const onFetchData = (data: any) => {
    setCalendarData(data);
    setNickname(data.user_profile.nickname);
  };

  const onEmojiClick = (diary_id: number) => {
    setSelectedDiaryId(diary_id);
  };

  if (diaryLoading) {
    return <Message>Loading...</Message>;
  }

  return (
    <HomeWrapper
      isExpanded={isExpanded}
      background_color={diary?.body.background_color ?? undefined}
    >
      <LeftSection>
        <CalendarSection>
          <CalendarHeader>
            📅 {nickname} 님의 달력
            {!isOwnProfile && <AddMateButton />}
          </CalendarHeader>
          <Calendar onFetchData={onFetchData} onEmojiClick={onEmojiClick} />
        </CalendarSection>
        <PlaylistSection>
          <PlaylistHeader>🎵 {nickname} 님의 플레이리스트</PlaylistHeader>
          <PlayList />
        </PlaylistSection>
      </LeftSection>
      <Right>
        <RightSection
          isExpanded={isExpanded}
          background_color={diary?.body.background_color ?? undefined}
          initial={{ right: "0" }}
          animate={{
            width: isExpanded ? "calc(100% - 70px)" : "",
          }}
          transition={{ duration: 0.5, ease: "linear" }}
        >
           {diary && selectedDiaryId ? (
            <>
              <DiaryItem
                diary={diary}
                user={diary.user_profile}
                likedUsers={[]}
                isExpanded={isExpanded}
                toggleExpand={handleExpand}
              />
              {diary.body.music && (
                <MusicBar
                  youtubeUrl={diary.body.music.music_url}
                  title={diary.body.music.title}
                  artist={diary.body.music.artist}
                  isExpanded={isExpanded}
                />
              )}
            </>
          ) : (
            <Message>
              <p>날짜를 선택하여 일기를 확인해보세요!</p>
            </Message>
          )}
        </RightSection>
      </Right>
    </HomeWrapper>
  );
};

export default Home;

const HomeWrapper = styled.div<RightSectionProps>`
  display: flex;
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow-x: hidden;
  /* padding-bottom: ${({ isExpanded }) => (isExpanded ? "20%" : "0")}; */
  /* margin-bottom: ${({ isExpanded }) => (isExpanded ? "60px" : "0")}; */
`;

const LeftSection = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding-top: 10px;
  border-right: 1px solid ${({ theme }) => theme.color.grayDF};
  height: 100%;
  z-index: 0;
`;

const CalendarSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  max-width: 700px;
  padding: 20px;
`;

const CalendarHeader = styled.div`
  margin-bottom: 10px;
  font-size: ${({ theme }) => theme.title.title4};
  font-family: ${({ theme }) => theme.fontFamily.kor};
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PlaylistSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  max-width: 700px;
  padding: 20px;
`;

const PlaylistHeader = styled.div`
  margin-bottom: 10px;
  font-size: ${({ theme }) => theme.title.title4};
  font-family: ${({ theme }) => theme.fontFamily.kor};
  text-align: left;
`;

interface RightSectionProps {
  isExpanded: boolean;
  background_color?: string | null;
}

const Right = styled.div`
  flex: 1;
`;

const RightSection = styled(motion.div)<RightSectionProps>`
  display: flex;
  flex-direction: column;
  flex: 1;
  position: ${({ isExpanded }) => (isExpanded ? "absolute" : "relative")};
  right: 0;
  height: ${({ isExpanded }) => (isExpanded ? "" : "100%")};
  background-color: ${({ theme, background_color }) =>
    background_color ? theme.diaryColor[background_color]?.background : theme.color.white};
  z-index: 1;
  box-sizing: border-box;
  overflow: hidden;
`;

const Message = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  text-align: center;
  background-color: white;
  p {
    font-size: ${({ theme }) => theme.text.text1};
    color: ${({ theme }) => theme.color.gray777};
    font-family: ${({ theme }) => theme.fontFamily.kor};
  }
`;
