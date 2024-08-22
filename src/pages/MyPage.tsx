import { useState } from 'react';
import styled from 'styled-components';
import Background from "../assets/images/mypage/mypage-bg.jpg";
import { FiCamera, FiBook, FiActivity, FiMusic, FiSettings } from "react-icons/fi";
import { motion } from 'framer-motion';
import AllDiaries from '../components/mypage/AllDiaries';
import MoodGraph from '../components/mypage/MoodGraph';
import Playlist from '../components/mypage/Playlist';
import Settings from '../components/mypage/Settings';
import { useMyPage } from '../hooks/useMyPage';

const MyPage = () => {
  const tabs = [
    { 
      title: "All Diaries", 
      icon: <FiBook />, 
      component: <AllDiaries /> 
    },
    { 
      title: "Mood Graph", 
      icon: <FiActivity />, 
      component: <MoodGraph /> 
    },
    { 
      title: "Playlist", 
      icon: <FiMusic />, 
      component: <Playlist /> 
    },
    { 
      title: "Settings", 
      icon: <FiSettings />, 
      component: <Settings /> 
    },
  ];

  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const { userProfile } = useMyPage();

  return (
    <MyPageWrapper>
      <BackgroundImg>
        {/* 배경사진 변경 */}
        <div className="background-img"></div>
        <button className="change-btn">
          <FiCamera />
          <span>배경 변경</span>
        </button>
      </BackgroundImg>
      <MyPageContents>
        <UserInfo>
          {/* 사용자 정보 */}
          <InfoBox>
            {/* 프로필사진 변경 */}
            <ProfileImg>
              <div className="image"></div>
            </ProfileImg>
            <div className="nickname">{userProfile?.nickname}</div>
            <div className="email">{userProfile?.email_address}</div>
            <div className="count">
              <div className="item mates">
                <span className="name">친구</span>
                <span className="num">{userProfile?.mate_count}</span>
              </div>
              <div className="item diaries">
                <span className="name">일기</span>
                <span className="num">{userProfile?.diary_count}</span>
              </div>
            </div>
          </InfoBox>
        </UserInfo>
        {/* 사용자 피드 */}
        <UserFeed>
          <FeedList>
          {tabs.map((tab, index) => {
              return (
                <FeedItem 
                  key={index}
                  isActive={tab.title === selectedTab.title}
                  onClick={() => setSelectedTab(tab)}
                >
                  {tab.icon}
                  <span>{tab.title}</span>
                  {/* 피드 리스트 배경 모션 */}
                  {tab.title === selectedTab.title && (
                    <FeedItemBackground
                      layoutId="feedActiveBackground"
                      initial={ false }
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    />
                  )}
                </FeedItem>
              );
            })}
          </FeedList>
          <FeedContent>{selectedTab.component}</FeedContent>
        </UserFeed>
      </MyPageContents>
    </MyPageWrapper>
  )
};

export default MyPage;

const MyPageWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const BackgroundImg = styled.div`
  position: relative;
  height: 250px;

  .background-img {
    width: 100%;
    height: 100%;
    /* 배경사진 미설정 시 */
    background-color: ${({ theme }) => theme.color.grayEEE};
    /* 배경사진 설정 시 */
    background-image: url(${Background});
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  .change-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 6px;
    padding: 6.5px 12px 5px 12px;
    color: ${({ theme }) => theme.color.black};
    background-color: #CCCCCC4D;
    font-size: ${({ theme }) => theme.text.text3};
    border: none;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    transition: all 0.15s ease-in-out;
    cursor: pointer;

    svg {
      font-size: ${({ theme }) => theme.text.text2};
      margin-bottom: 1.5px;
    }

    &:hover {
      background-color: #cccccc7D;
      transition: all 0.15s ease-in-out;
    }
  }
`;

const MyPageContents = styled.div`
  width: 100%;
  height: 100%;
`;

const UserInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.grayDF};
`;

const InfoBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
  width: 1042px;
  padding: 0 258px;
  
  .nickname {
    font-size: ${({ theme }) => theme.title.title1};
    font-weight: 600;
  }
  
  .email {
    font-size: ${({ theme }) => theme.text.text1};
    color: ${({ theme }) => theme.color.gray777};
  }
  
  .count {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 32px;
    
    .item {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      gap: 6px;
      font-family: ${({ theme }) => theme.fontFamily.kor};
      
      .name {
        font-size: ${({ theme }) => theme.title.title4};
        font-weight: 400;
      }
      
      .num {
        font-size: ${({ theme }) => theme.title.title3};
        font-weight: 500;
      }
    }
  }
`;

const ProfileImg = styled.div`
  position: absolute;
  top: -113px;
  left: 64px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 3px solid ${({ theme }) => theme.color.white};
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

  .image {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    /* 배경사진 미설정 시 */
    background-color: ${({ theme }) => theme.color.grayEEE};
    /* 배경사진 설정 시 */
    background-image: url(${Background});
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }
`;

const UserFeed = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FeedList = styled.ul`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 10px 0;
`;

const FeedItem = styled.li<{ isActive: boolean }>`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  color: ${({ theme, isActive }) => isActive ? theme.color.greenblue : theme.color.grayblack};
  font-weight: 400;
  border-radius: 8px;
  transition: all 0.15s ease-in-out;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.color.greenblue};
    transition: all 0.15s ease-in-out;
  }
`;

const FeedItemBackground = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.color.lightblue30};
  border-radius: 8px;
  z-index: -1;
`;

const FeedContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  /* padding: 20px 0; */
  padding-top: 20px;
  padding-bottom: 60px;
  width: 100%;
  height: 100%;
`;