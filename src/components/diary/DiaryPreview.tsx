import styled from "styled-components";
import DiaryContent from "./DiaryContent";
import profile from "../../assets/images/mypage/mypage-bg.jpg";
import MusicBar from "../musicbar/MusicBar";

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
  avgTemperature: string;
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
  const diary = {
    id: 1, // 임의로 설정
    user_id: "damii",
    like_count: 0,
    created_at: formattedDate,
    body: {
      title,
      content,
      img_urls: imgUrls,
      mood: selectedMood,
      emoji: selectedEmoji,
      privacy: selectedPrivacy,
      music: {
        title: musicTitle,
        artist: musicArtist,
        music_url: musicUrl,
      },
      weather: {
        icon: weatherIcon,
        location,
        avg_temperature: Number(avgTemperature),
      },
      background_color: selectedBgColor,
    },
  };

  return (
    <DiaryPreviewWrapper>
      <DiaryPreviewContents bgColor={selectedBgColor}>
        <Header>
          <div className="date">{formattedDate}</div>
          <ProfileWrapper>
            <div className="profile"></div>
            <span>damii</span>
          </ProfileWrapper>
        </Header>
        <Title>{title}</Title>
        {/* <DiaryContent
          diary={diary} 
          isSummary={false} 
          isExpanded={true} 
          user={{
            user_id: 0,
            profileImgURL: null,
            nickname: ""
          }} 
          likedUsers={[]} 
        /> */}
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
  padding: 60px 0;
  background-color: ${({ theme, bgColor }) =>
    theme.diaryColor[bgColor].background};
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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
