import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FiCamera, FiBook, FiActivity, FiMusic, FiSettings } from "react-icons/fi";
import { motion } from 'framer-motion';
import AllDiaries from '../components/mypage/AllDiaries';
import MoodGraph from '../components/mypage/MoodGraph';
import Playlist from '../components/mypage/Playlist';
import Settings from '../components/mypage/Settings';
import { useMyPage } from '../hooks/useMyPage';
import { saveBackgroundImage, saveProfileImage, uploadProfileImage } from '../api/uploadProfileImage';
import { FaUserCircle } from "react-icons/fa";

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
  const { userProfile, error } = useMyPage();
  const [selectedImage, setSelectedImage] = useState(userProfile?.profile_img_url);
  const [selectedBackground, setSelectedBackground] = useState(userProfile?.profile_background_img_url);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);


  if (error) {
    throw new Error("네트워크 오류 발생: " + error.message);
  }
  
  const handleCameraClick = () => {
    fileInputRef.current!.click();
  };

  const handleBackgroundClick = () => {
    if (backgroundInputRef.current) {
      backgroundInputRef.current.click();
    }
  };

  useEffect(() => {
    if (userProfile?.profile_img_url) {
      setSelectedImage(userProfile.profile_img_url);
    }
    if (userProfile?.profile_background_img_url) {
      setSelectedBackground(userProfile.profile_background_img_url);
    }
  }, [userProfile]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>, 
    isBackground: boolean = false
  ) => {
    const file = event.target.files?.[0];

    if (file && userProfile) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (isBackground) {
            setSelectedBackground(reader.result as string); // 로컬 미리보기 - 배경 이미지
          } else {
            setSelectedImage(reader.result as string); // 로컬 미리보기 - 프로필 이미지
          }
        };
        reader.readAsDataURL(file);
        const filename = isBackground ? `${userProfile.id}/profile/background_image.png` : `${userProfile.id}/profile/profile_image.png`;
        const imageDetails = [{ file: file, filename: filename }];
        const uploadedImageUrls = await uploadProfileImage(imageDetails);

        // 서버에서 받은 첫 번째 이미지 URL을 배경 이미지 또는 프로필 이미지로 설정
        if (uploadedImageUrls.length > 0) {
          if (isBackground) {
            saveBackgroundImage(uploadedImageUrls[0]);
          } else {
            saveProfileImage(uploadedImageUrls[0]);
          }
        }
      } catch (error) {
        console.error('Error uploading the image:', error);
      } 
    }
  };

  return (
    <MyPageWrapper>
      <BackgroundImg >
      <div className="background-img" style={{ backgroundImage: `url(${selectedBackground})` }}></div>
        <button className="change-btn" onClick={handleBackgroundClick} >
          <FiCamera />
          <span>배경 변경</span>
        </button>
        <input
          type="file"
          ref={backgroundInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={(event) => handleFileChange(event, true)}
        />
      </BackgroundImg>
      <MyPageContents>
        <UserInfo>
          {/* 사용자 정보 */}
          <InfoBox>
            {/* 프로필사진 변경 */}
            <ProfileImg>
            {selectedImage ? (
              <div className="image" style={{ backgroundImage: `url(${selectedImage})` }}></div>
            ) : (
              <div className="image"><DefaultProfileIcon size={174} /></div>  
            )}
              <div className="camera-btn" onClick={handleCameraClick}>
                <FiCamera />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={(event) => handleFileChange(event, false)} 
              />
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
const DefaultProfileIcon = styled(FaUserCircle)`
  width: 174px;
  height: 174px;
  color: ${({ theme }) => theme.color.gray999};
`;

const BackgroundImg = styled.div`
  position: relative;
  height: 250px;

  .background-img {
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.color.grayEEE};
    /* 배경사진 설정 시 */
    
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
    background-color: ${({ theme }) => theme.color.white};
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  /* 카메라 버튼 추가 */
  .camera-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    background-color: ${({ theme }) => theme.color.gray999};
    border: 2px solid ${({ theme }) => theme.color.grayEEE};
    border-radius: 50%;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: ${({ theme }) => theme.color.grayDF};
    }

    svg {
      font-size: 20px;
      color: ${({ theme }) => theme.color.white};
    }
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