import styled from 'styled-components';
import DiaryEditor from '../components/diary/DiaryEditor';
import { FiPlusCircle, FiUser, FiLock, FiSearch, FiSend } from "react-icons/fi";
import { VscSymbolColor } from "react-icons/vsc";
import { RiGlobalLine } from "react-icons/ri";
import Button from '../components/button/Button';
import { useEffect, useRef, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import DiaryPreview from '../components/diary/DiaryPreview';
import { colors, moods, privacies } from '../constants/writeDiary';
import { useGeoLocation } from '../hooks/useGeoLocation';
import { useDiaries } from '../hooks/useDiary';
import { IDiary } from '../models/diary.model';
import { useNavigate } from 'react-router-dom';

const geolocationOptions = {
  enableHighAccuracy: true,
  timeout: 1000 * 30,
  maximumAge: 1000 * 3600 * 24,
}

const WriteDiary = () => {
  // 상태 변수 선언
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const [selectedBgColor, setSelectedBgColor] = useState<string>("default");
  const [selectedMood, setSelectedMood] = useState<string>("😍");
  const [selectedPrivacy, setSelectedPrivacy] = useState<string>(privacies[2]);
  const [musicTitle, setMusicTitle] = useState<string>("");
  const [musicArtist, setMusicArtist] = useState<string>("");
  const [musicUrl, setMusicUrl] = useState<string>("");
  const [weatherIcon, setWeatherIcon] = useState<string>("");
  const [weatherLocation, setWeatherLocation] = useState<string>(""); // 위치
  const [weatherTemp, setWeatherTemp] = useState<number>(0);

  const navigate = useNavigate();

  const { saveDiary, loading, wirteDiaryErr } = useDiaries();

  // 일기 데이터 작성 및 제출
  const handleSubmit = async () => {
    const diaryData: IDiary["body"] = {
      title: title || "",
      content: content || "",
      img_urls: [], // 예시로 비워둠. 이미지 URL을 관리할 필요가 있음
      mood: selectedMood || "😍",
      emoji: selectedEmoji || "",
      privacy: (selectedPrivacy as "public" | "mate" | "private") || privacies[2],
      music: {
        title: musicTitle || "",
        artist: musicArtist || "",
        music_url: musicUrl || "",
      },
      weather: {
        icon: weatherIcon || "",
        location: weatherLocation || "",
        avg_temperature: weatherTemp || 0,
      },
      background_color: selectedBgColor || "default",
    };
    
    await saveDiary(diaryData); // saveDiary 호출

    // if (diaryData) {
    //   window.alert("일기가 저장되었습니다.");
    //   navigate("/home");
    // } else {
    //   window.alert("모든 항목을 작성해주세요.");
    //   window.location.reload();
    // }

  };
  

  // 날짜, 요일
  const week = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const today = new Date();
  const todayDay = week[today.getDay()];
  const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 ${todayDay}`;

  // 날씨
  const { location, error } = useGeoLocation(geolocationOptions);
  let lat = location?.latitude;
  let long = location?.longitude;
  // console.log("위도 : ", lat);
  // console.log("경도 : ", long);

  useEffect(() => {
    if(lat && long !== undefined) {
      fetch(`https://api.melodiary.site/api/weather?latitude=${lat}&longitude=${long}`, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`
        }
      })
      .then(res => res.json())
      .then((data) => {
        setWeatherIcon(data.icon);
        setWeatherLocation(data.location);
        setWeatherTemp(data.avg_temperature);
      })
      .catch((err) => {
        console.log("날씨 정보 불러오기 에러 : ", err);
      })
    } else {
      fetch(`https://api.melodiary.site/api/weather?latitude=37.564214&longitude=127.001699`, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`
        }
      })
      .then(res => res.json())
      .then((data) => {
        setWeatherIcon(data.icon);
        setWeatherLocation("Seoul");
        setWeatherTemp(data.avg_temperature);
      })
      .catch((err) => {
        console.log("날씨 정보 불러오기 에러 : ", err);
      })
    }
  }, [weatherLocation]);

  // 드롭다운 여부 (오늘의 이모지, 배경 색상, 기분, 공개 범위, 미리보기)
  const [isEmojiDropdown, setIsEmojiDropdown] = useState(false);
  const [isBgColorDropdown, setIsBgColorDropdown] = useState(false);
  const [isMoodDropdown, setIsMoodDropdown] = useState(false);
  const [isPrivacyDropdown, setIsPrivacyDropdown] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // 현재 드롭다운이 되는 영역 (오늘의 이모지, 배경 색상, 기분, 공개 범위, 미리보기)
  const emojiDropdownRef = useRef<HTMLDivElement>(null);
  const bgColorDropdownRef = useRef<HTMLDivElement>(null);
  const moodDropdownRef = useRef<HTMLDivElement>(null);
  const privacyDropdownRef = useRef<HTMLDivElement>(null);
  const previewOpenRef = useRef<HTMLDivElement>(null);

  // 드롭다운 토글 함수 (오늘의 이모지, 배경 색상, 기분, 공개 범위)
  const toogleEmojiDropdown = () => {
    setIsEmojiDropdown(!isEmojiDropdown);
  };
  const toogleBgColorDropdown = () => {
    setIsBgColorDropdown(!isBgColorDropdown);
  };
  const toogleMoodDropdown = () => {
    setIsMoodDropdown(!isMoodDropdown);
  };
  const tooglePrivacyDropdown = () => {
    setIsPrivacyDropdown(!isPrivacyDropdown);
  };
  const tooglePreviewOpen = () => {
    setIsPreviewOpen(!isPreviewOpen);
  };

  // 드롭다운 옵션 (배경 색상, 기분, 공개 범위)
  const selectBgColorOption = (option: string) => {
    setSelectedBgColor(option);
    setIsBgColorDropdown(false);
  };
  const selectMoodOption = (option: string) => {
    setSelectedMood(option);
    setIsMoodDropdown(false);
  };
  const selectPrivacyOption = (option: string) => {
    setSelectedPrivacy(option);
    setIsPrivacyDropdown(false);
  };

  // 외부 클릭 시 드롭다운 닫힘 (오늘의 이모지, 배경 색상, 기분, 공개 범위, 미리보기)
  const handleClickEmojiOutside = (e: MouseEvent) => {
    if(emojiDropdownRef.current && !emojiDropdownRef.current.contains(e.target as Node)) {
      setIsEmojiDropdown(false);
    }
  };
  const handleClickBgColorOutside = (e: MouseEvent) => {
    if(bgColorDropdownRef.current && !bgColorDropdownRef.current.contains(e.target as Node)) {
      setIsBgColorDropdown(false);
    }
  };
  const handleClickMoodOutside = (e: MouseEvent) => {
    if(moodDropdownRef.current && !moodDropdownRef.current.contains(e.target as Node)) {
      setIsMoodDropdown(false);
    }
  };
  const handleClickPrivacyOutside = (e: MouseEvent) => {
    if(privacyDropdownRef.current && !privacyDropdownRef.current.contains(e.target as Node)) {
      setIsPrivacyDropdown(false);
    }
  };
  const handleClickPreivewOutside = (e: MouseEvent) => {
    if(previewOpenRef.current && !previewOpenRef.current.contains(e.target as Node)) {
      setIsPreviewOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickEmojiOutside);
    document.addEventListener("click", handleClickBgColorOutside);
    document.addEventListener("click", handleClickMoodOutside);
    document.addEventListener("click", handleClickPrivacyOutside);
    document.addEventListener("click", handleClickPreivewOutside);
    return () => {
      document.removeEventListener("click", handleClickEmojiOutside);
      document.removeEventListener("click", handleClickBgColorOutside);
      document.removeEventListener("click", handleClickMoodOutside);
      document.removeEventListener("click", handleClickPrivacyOutside);
      document.removeEventListener("click", handleClickPreivewOutside);
    };
  }, []);

  const getPrivacyIcon = (privacyName: string) => {
    switch (privacyName) {
      case "public":
        return <><RiGlobalLine /> 전체 공개</>;
      case "mate":
        return <><FiUser /> 친구 공개</>;
      case "private":
        return <><FiLock /> 비공개</>;
      default:
        return null;
    }
  };

  return (
    <WriteDiaryWrapper bgColor={selectedBgColor}>
      {isPreviewOpen && (
        <DiaryPreview
          title={title}
          content={content}
          selectedEmoji={selectedEmoji}
          selectedBgColor={selectedBgColor}
          selectedMood={selectedMood}
          selectedPrivacy={selectedPrivacy}
          musicTitle={musicTitle}
          musicArtist={musicArtist}
          musicUrl={musicUrl}
          formattedDate={formattedDate}
          location={''} 
          weatherIcon={''} 
          avgTemperature={''} 
          imgUrls={[]}
        />
      )}
      <WriteDiaryContents>
        {/* 아이콘 추가, 배경 색상 추가 */}
        <div className="today-emoji">
          {selectedEmoji}
        </div>
        <IconBg>
          <div className="icon" ref={emojiDropdownRef}>
            <div onClick={toogleEmojiDropdown}>
              <FiPlusCircle />
              <span>아이콘 추가</span>
            </div>
            {isEmojiDropdown && (
              <div className="emoji-picker">
                <EmojiPicker
                  searchDisabled={false}
                  previewConfig={{
                    showPreview: true,
                    defaultEmoji: "1f92a",
                    defaultCaption: "Emoji"
                  }}
                  onEmojiClick={(e) => {
                    setSelectedEmoji(e.emoji)
                  }}
                />
              </div>
            )}
          </div>
          <div className="bgColor" ref={bgColorDropdownRef}>
            <div onClick={toogleBgColorDropdown}>
              <VscSymbolColor />
              <span>배경 색상 추가</span>
            </div>
            {isBgColorDropdown && (
              <ul className="bgColor-list">
                {colors.map((color, index) => (
                  <li
                    key={index}
                    onClick={() => selectBgColorOption(color.name)}
                    style={{ backgroundColor: color.background }}
                  />
                ))}
              </ul>
            )}
          </div>
        </IconBg>
        {/* 제목 */}
        <Title
          type="text"
          placeholder="제목"
          onChange={(e) => setTitle(e.target.value)}
        />
        {/* 오늘의 기분 */}
        <Section className="mood">
          <label>오늘의 기분</label>
          <div className="select-mood-box" ref={moodDropdownRef}>
            <div className="selected-mood" onClick={toogleMoodDropdown}>
              {selectedMood}
            </div>
            {isMoodDropdown && (
              <ul className="mood-list">
                {moods.map((mood, index) => (
                  <li key={index} onClick={() => selectMoodOption(mood)}>
                    {mood}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Section>
        {/* 오늘의 날짜 */}
        <Section className="today">
          <label>날짜</label>
          <span>{formattedDate}</span>
        </Section>
        {/* 오늘의 날씨 */}
        <Section className="weather">
          <label>날씨</label>
          <div className="weather-info">
            <span>{weatherLocation}</span>
            <span>/</span>
            <span>{weatherIcon}</span>
            <span>/</span>
            <span>{weatherTemp}℃</span>
          </div>
        </Section>
        {/* 오늘의 음악 */}
        <Section className="music">
          <label>음악</label>
          <div className="music-info">
            <input
              type="text"
              placeholder="TITLE"
              value={musicTitle}
              onChange={(e) => setMusicTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="ARTIST"
              value={musicArtist}
              onChange={(e) => setMusicArtist(e.target.value)}
            />
            <input
              type="text"
              placeholder="YOUTUBE URL"
              value={musicUrl}
              onChange={(e) => setMusicUrl(e.target.value)}
            />
          </div>
        </Section>
        {/* 일기 공개 범위 */}
        <Section className="privacy">
          <label>공개범위</label>
          <div className="select-privacy-box" ref={privacyDropdownRef}>
            <div className="selected-privacy" onClick={tooglePrivacyDropdown}>
              {getPrivacyIcon(selectedPrivacy)}
            </div>
            {isPrivacyDropdown && (
              <ul className="privacy-list">
                {privacies.map((privacy) => (
                  <li 
                    key={privacy} 
                    onClick={() => selectPrivacyOption(privacy)}
                  >
                    {getPrivacyIcon(privacy)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Section>
        {/* 일기 작성 에디터 */}
        <DiaryEditor
          content={content}
          onChange={setContent}
        />
        {/* 미리보기, 등록하기 BTN */}
        <SubmitBox ref={previewOpenRef}>
          <Button
            size="short" 
            schema="gray"
            type="button"
            onClick={tooglePreviewOpen}
          >
            <FiSearch size={16} /> 미리보기
          </Button>
          <Button 
            size="short" 
            schema="gray"
            onClick={handleSubmit} // 제출 버튼에 이벤트 핸들러 연결
            disabled={loading} // 로딩 중에는 버튼 비활성화
          >
            <FiSend size={16} />
            {loading ? "저장 중..." : "등록하기"}
          </Button>
        </SubmitBox>
        {error && <p>{error}</p>} {/* 오류 메시지 표시 */}
      </WriteDiaryContents>
    </WriteDiaryWrapper>
  )
};

const WriteDiaryWrapper = styled.div<{ bgColor: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 80px 10%;
  background-color: ${({ theme, bgColor }) => theme.diaryColor[bgColor].background};
  position: relative;

  &:-webkit-scrollbar {
    display: none;
  }
`;

const WriteDiaryContents = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  height: 100%;
  color: ${({ theme }) => theme.color.gray777};
  font-size: ${({ theme }) => theme.text.text2};

  input, select {
    background-color: transparent;
    border: none;
    outline: none;
    text-align: left;

    &::placeholder {
      color: ${({ theme }) => theme.color.grayDF};
    }
  }

  .today-emoji {
    font-size: 48px;
  }
`;

const IconBg = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
  font-family: ${({ theme }) => theme.fontFamily.kor};
  font-size: ${({ theme }) => theme.text.text2};

  .icon > div,
  .bgColor > div {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    transition: all 0.15s ease-in-out;

    svg {
      font-size: ${({ theme }) => theme.title.title4};
    }

    &:hover {
      color: ${({ theme }) => theme.color.grayblack};
      transition: all 0.15s ease-in-out;
    }
  }
  /* 오늘의 이모지 */
  .icon {
    position: relative;

    .emoji-picker {
      position: absolute;
      top: 28px;
      left: 0;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      z-index: 999;

      .epr_-8ygbw8 {
        padding: 8px 10px;
      }

      .epr_-kg0voo {
        display: none;
      }
    }
  }

  /* 일기 배경 색상 */
  .bgColor {
    position: relative;
    
    .bgColor-list {
      position: absolute;
      top: 28px;
      left: 0;
      display: flex;
      flex-direction: row;
      gap: 8px;
      padding: 12px 16px;
      background-color: ${({ theme }) => theme.color.white};
      border: 1px solid #E7E7E7;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      z-index: 999;
  
      li {
        width: 24px;
        height: 24px;
        border: 1px solid ${({ theme }) => theme.color.grayCCC};
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.1s ease-in-out;

        &:hover {
          border: 1px solid ${({ theme }) => theme.color.gray999};
          transition: all 0.1s ease-in-out;
        }
      }
    }
  }
`;

const Title = styled.input`
  width: 100%;
  padding: 8px 0;
  font-family: ${({ theme }) => theme.fontFamily.kor};
  font-size: ${({ theme }) => theme.title.title1};
  font-weight: 600;
`;

const Section = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  font-family: ${({ theme }) => theme.fontFamily.kor};
  font-size: ${({ theme }) => theme.text.text2};

  label {
    width: 140px;
  }

  /* 음악 */
  &.music {
    align-items: flex-start;

    .music-info {
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1;
      padding: 4px 0;

      input {
        width: 100%;
        color: ${({ theme }) => theme.color.gray777};
      }
    }
  }

  /* 오늘의 기분 */
  .select-mood-box {
    position: relative;

    .selected-mood {
      font-size: 20px;
      cursor: pointer;
    }

    .mood-list {
      position: absolute;
      top: 28px;
      left: 0;
      display: flex;
      flex-direction: row;
      gap: 16px;
      padding: 10px 14px;
      background-color: ${({ theme }) => theme.color.white};
      border: 1px solid #E7E7E7;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      z-index: 999;

      li {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        font-size: 20px;
        transition: all 0.15s ease-in-out;

        &:hover {
          transform: translateY(-2px);
          transition: all 0.15s ease-in-out;
        }
      }
    }
  }
  // 날씨 정보
  .weather-info {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
  }

  /* 일기 공개 범위 */
  .select-privacy-box {
    position: relative;

    .selected-privacy {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      transition: all 0.15s ease-in-out;

      &:hover {
        color: ${({ theme }) => theme.color.grayblack};
        transition: all 0.15s ease-in-out;
      }
    }

    .privacy-list {
      position: absolute;
      top: 28px;
      left: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 124px;
      padding: 12px 16px;
      background-color: ${({ theme }) => theme.color.white};
      border: 1px solid #E7E7E7;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      z-index: 999;

      li {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        transition: all 0.1s ease-in-out;
        
        &:hover {
          color: ${({ theme }) => theme.color.grayblack};
          transition: all 0.1s ease-in-out;
        }
      }
    }
  }
`;

const SubmitBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
`;

export default WriteDiary;