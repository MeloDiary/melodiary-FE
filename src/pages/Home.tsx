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
  const user_id = localStorage.getItem('user_id');
  const [nickname, setNickname] = useState<string | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [calendarData, setCalendarData] = useState<any>(null);

 //검색시 기타 부분에서 state를 받아오기 위해 설정해놓았던 부분입니다! 
  // Calander api 연결 후 수정하겠습니다.
  const state = location.state as LocationState | undefined;

  const parsedUserId = userId ? Number(userId) : 1;

  const [diaryId, setDiaryId] = useState<number>(69);
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useUserData(parsedUserId);
  
  const { diary, loading: diaryLoading } = useDiary(diaryId);

  const [isExpanded, setIsExpanded] = useState(state?.isExpanded ?? false);

  useEffect(() => {
    if (userId && user_id) {
      setIsOwnProfile(userId === user_id); // userId와 user_id가 같은지 비교
    }
  }, [userId, user_id]);

  // useEffect(() => {
  //   if (parsedUserId) {
  //     setDiaryId(69);
  //   }
  // }, [parsedUserId]);

  useEffect(() => {
    if (state?.isExpanded !== undefined) {
      setIsExpanded(state.isExpanded);
    }
  }, [state?.isExpanded]);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const onFetchData = (data: any) => {
    setCalendarData(data); // Calender에서 받은 데이터를 Home의 상태로 설정
    setNickname(data.user_profile.nickname);
  };

  const onEmojiClick = (diary_id: number) => {
    //이모지 클릭시 이 함수에서 다이어리 아이디를 받아옴
    console.log('diary_id:', diary_id);
  };

  //검색시 기타 부분에서 state를 받아오기 위해 설정해놓았던 부분입니다! 
  // Calander api 연결 후 수정하겠습니다.
  const displayNickname = state?.nickname || user?.nickname || parsedUserId;
  const profileImageUrl = state?.profileImgUrl || user?.profile_img_url;

  if (userLoading || diaryLoading) {
    return <Message>Loading...</Message>;
  }

  return (
    <HomeWrapper>
      <LeftSection>
        <CalendarSection>
          <CalendarHeader>
            📅 {nickname} 님의 달력
            {!isOwnProfile && (
              <AddMateButton/>
            )}
          </CalendarHeader>
          <Calendar onFetchData={onFetchData} onEmojiClick={onEmojiClick}  />
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
          initial={{ width: "auto" }} 
          animate={{ width: isExpanded ? "100%" : "auto" }}
          transition={{ duration: 0.5, ease: "easeInOut" }} 
        >
          {diary && user ? (
            <>
              <DiaryItem
                diary={diary}
                user={user}
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
            <Message>날짜를 선택하여 일기를 확인해보세요!</Message>
          )}
        </RightSection>
      </Right>
    </HomeWrapper>
  );
};

export default Home;

const HomeWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100vh; /* 높이를 화면 전체로 설정 */
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow-x: hidden;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const RightSection = styled(motion.div)<RightSectionProps>`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  position: ${({ isExpanded }) =>
    isExpanded ? "absolute" : "relative"}; 
  top: 0;
  right: 0;
  height: 100%;
  background-color: ${({ theme, background_color }) =>
    theme.diaryColor[background_color ?? "default"]?.background ||
    theme.diaryColor.default.background};
  z-index: 1;
  box-sizing: border-box;
  overflow: hidden;
`;

const Message = styled.div`
  font-size: ${({ theme }) => theme.text.text1};
  color: ${({ theme }) => theme.color.gray777};
  font-family: ${({ theme }) => theme.fontFamily.kor};
  text-align: center;
`;
