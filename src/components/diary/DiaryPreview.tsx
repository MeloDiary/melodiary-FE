import styled from "styled-components";
import DiaryContent from "./DiaryContent";
import profile from "../../assets/images/mypage/mypage-bg.jpg";
import MusicBar from "../musicbar/MusicBar";
import { useMyPage } from "../../hooks/useMyPage";
import { IDiary } from "../../models/diary.model";
import { getPrivacyIcon } from "../../pages/WriteDiary";

interface Props {
  title: string;
  content: string;
  selectedEmoji: string;
  selectedBgColor: string;
  selectedMood: string;
  selectedPrivacy: string;
  musicTitle: string;
  musicArtist: string;
  musicUrl: string;
  formattedDate: string;
  location: string;
  weatherIcon: string;
  avgTemperature: number;
  imgUrls: string[];
}

const DiaryPreview = ({
  title,
  content,
  selectedEmoji,
  selectedBgColor,
  selectedMood,
  selectedPrivacy,
  musicTitle,
  musicArtist,
  musicUrl,
  formattedDate,
  location,
  weatherIcon,
  avgTemperature,
  imgUrls,
}: Props) => {
  const { userProfile } = useMyPage();

  // DiaryContent에서 요구하는 구조를 따른 diary 객체 생성
  const diary: IDiary = {
    id: 1, // 임의로 설정
    user_profile: {
      user_id: userProfile?.id!, 
      nickname: userProfile?.nickname!, 
      profile_img_url: userProfile?.profile_img_url!, 
    },
    like_count: 0,
    created_at: formattedDate || null,
    body: {
      title: title || "", // title이 없을 때 빈 문자열을 기본값으로 설정
      content: content || "", // content가 없을 때 빈 문자열을 기본값으로 설정
      img_urls: imgUrls || null, // imgUrls이 없을 때 null로 설정
      mood: selectedMood || null,
      emoji: selectedEmoji || null,
      privacy: selectedPrivacy === "private" || selectedPrivacy === "public" || selectedPrivacy === "mate" ? selectedPrivacy : "private",
      music: {
        title: musicTitle,
        artist: musicArtist,
        music_url: musicUrl
      },
      weather: {
        location: location,
        icon: weatherIcon,
        avg_temperature: Number(avgTemperature),
      },
      background_color: selectedBgColor || null,
    },
    liked: false
  };

  return (
    <DiaryPreviewWrapper>
      <DiaryPreviewContents bgColor={selectedBgColor}>
        <Privacy>{getPrivacyIcon(selectedPrivacy)}</Privacy>
        <Header>
          <div className="date">{formattedDate}</div>
          <ProfileWrapper>
            <div className="profile"></div>
            <span>{userProfile?.nickname}</span> {/* 실제 사용자 이름으로 변경 */}
          </ProfileWrapper>
        </Header>
        <Title>{title}</Title>
        <DiaryContent
          diary={diary} 
          isSummary={false} 
          isExpanded={true}
        />
        <MusicBar
          isExpanded={true}
          title={musicTitle}
          artist={musicArtist}
          youtubeUrl={musicUrl}
        />
      </DiaryPreviewContents>
    </DiaryPreviewWrapper>
  );
};

export default DiaryPreview;

// 스타일 컴포넌트
const DiaryPreviewWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.color.white};
  z-index: 9999;
`;

const DiaryPreviewContents = styled.div<{ bgColor: string }>`
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  width: 80%;
  height: 90%;
  padding: 80px 0;
  background-color: ${({ theme, bgColor }) =>
    theme.diaryColor[bgColor].background};
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

const Privacy = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
  padding: 0 10%;
  color: ${({ theme }) => theme.color.gray999};
  font-size: ${({ theme }) => theme.text.text3};
  cursor: pointer;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 10%;

  .date {
    font-size: ${({ theme }) => theme.text.text2};
  }
`;

const Title = styled.div`
  margin-bottom: 16px;
  padding: 0 10%;
  font-size: ${({ theme }) => theme.title.title1};
  font-weight: 600;
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;

  .profile {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
    background-image: url(${profile});
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  span {
    font-size: ${({ theme }) => theme.text.text2};
    font-weight: 400;
  }
`;