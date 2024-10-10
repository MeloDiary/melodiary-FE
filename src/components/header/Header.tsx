import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import {
  BiBell,
  BiEdit,
  BiHeadphone,
  BiHelpCircle,
  BiSolidChevronDown,
} from "react-icons/bi";
import { CiLogout } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../hooks/useNotification";
import { useUserData } from "../../hooks/useUserData";

import Button from "../button/Button";
import NotificationDropdown from "../notification/NotificationDropdown";
import SearchBar from "./SearchBar";
import HelpOverlay from "../help/HelpOverlay";

import image1 from "../../assets/images/help/001.png";
import image2 from "../../assets/images/help/002.png";
import image3 from "../../assets/images/help/003.png";
import image4 from "../../assets/images/help/004.png";
import image5 from "../../assets/images/help/005.png";
import image6 from "../../assets/images/help/006.png";
import image7 from "../../assets/images/help/007.png";
import image8 from "../../assets/images/help/008.png";
import image9 from "../../assets/images/help/009.png";
import image10 from "../../assets/images/help/010.png";
import image11 from "../../assets/images/help/011.png";

const helpSteps = [
  { image: image9, text: "MeloDiary는 매일 일기를 작성하며 그날의 기분을 음악과 이모지로 표현하고, 친구와 일기 및 음악 목록을 공유할 수 있는 웹 서비스입니다." },
  { image: image9, text: "밖에서는 하지 못하는 이야기를 조심스럽게 나눠 볼까요? " },
  { image: image1, text: "홈 화면에서는 달력의 이모지를 통해 한눈에 일기를 확인할 수 있고 일기에 사용된 음악들을 확인할 수 있어요." },
  { image: image2, text: "달력의 날짜별 이모지를 누르면 해당 일기를 확인할 수 있어요!" },
  { image: image8, text: "일기 상단의 확장 버튼을 눌러 좋아요와 댓글을 확인하고 음악과 함께 일기를 감상해보세요!" },
  { image: image3, text: "Explore 페이지에서 유저들이 작성한 전체공개된 일기를 확인해보고, 댓글과 좋아요로 소통해봐요! 프로필을 클릭해서 친구가 되어보세요!" },
  { image: image4, text: "Mates 페이지에서는 친구 요청을 관리하고 친구 목록을 확인해보세요! 친구들이 작성한 친구 공개 일기를 감상하고 소통해보세요!" },
  { image: image5, text: "마이페이지에서 나의 각종 정보 수정이 가능하며, 내가 지금까지 작성한 모든 일기 확인이 가능해요!" },
  { image: image6, text: "기분 그래프를 통하여 나의 기분 현황을 살펴보세요!" },
  { image: image7, text: "또한, 지금까지 사용된 음악들도 한눈에 확인 해보고 음악이 사용된 일기도 감상하러 갈 수 있어요." },
  { image: image11, text: "상단 헤더를 통해 친구를 검색하여 새로운 친구를 만들거나, 친구의 홈을 구경가볼까요? " },
  { image: image10, text: "CreateDiary 버튼으로 오늘의 일기를 작성 해보세요!" },
  { image: image9, text: "그럼 이제 일기를 작성해보러 가볼까요?" },
];

const Header = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const storedUserId = localStorage.getItem("user_id");
  const userId = storedUserId ? Number(storedUserId) : null;
  
  const { notifications, fetchNotifications, markAsRead } = useNotifications(userId || 0);
  const { user, loading, error } = useUserData(userId!);

  useEffect(() => {
    const isFirstVisitAfterNickname = localStorage.getItem("firstVisitAfterNickname");
    if (isFirstVisitAfterNickname === "true") {
      setIsHelpOpen(true);
      localStorage.removeItem("firstVisitAfterNickname");
    }
  }, []);

  const onClickLogout = () => {
    logout();
    navigate("/");
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleNotificationDropdown = async () => {
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
    if (!isNotificationDropdownOpen) {
      await fetchNotifications();
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
      setIsProfileDropdownOpen(false);
    }
    if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
      setIsNotificationDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <HeaderWrapper>
        <Link to={`/home/${userId}`}>
          <Logo>
            <BiHeadphone size={24} />
            <h1>MeloDiary</h1>
          </Logo>
        </Link>
        <Container>
          <SearchBar />
          <ButtonContainer>
            <Link to="/writediary">
              <Button size="medium" schema="primary">
                <BiEdit size={20} /> Create Diary
              </Button>
            </Link>
          </ButtonContainer>
          <Icons>
            <IconButton onClick={() => setIsHelpOpen(true)}>
              <BiHelpCircle size={24} />
            </IconButton>
            <IconButton onClick={toggleNotificationDropdown}>
              <BiBell size={24} />
              {isNotificationDropdownOpen && (
                <NotificationDropdown
                  ref={notificationDropdownRef}
                  notifications={notifications}
                  loading={loading}
                  markAsRead={markAsRead}
                />
              )}
            </IconButton>
          </Icons>
          <Profile ref={profileDropdownRef}>
            <Link to="/mypage">
              {user?.profile_img_url ? (
                <img src={user.profile_img_url} alt="profile" />
              ) : (
                <DefaultProfileIcon size={32} />
              )}
            </Link>
            <span>{user?.nickname}</span>
            <IconButton onClick={toggleProfileDropdown}>
              <BiSolidChevronDown size={24} />
            </IconButton>
            {isProfileDropdownOpen && (
              <Dropdown>
                <DropdownItem onClick={onClickLogout}>
                  <CiLogout size={20} />
                  LOGOUT
                </DropdownItem>
              </Dropdown>
            )}
          </Profile>
        </Container>
      </HeaderWrapper>
      {isHelpOpen && (
        <HelpOverlay steps={helpSteps} onClose={() => setIsHelpOpen(false)} />
      )}
    </>
  );
};

export default Header;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 20px;
  background-color: ${({ theme }) => theme.color.white};
  border-bottom: 1px solid ${({ theme }) => theme.color.grayDF};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;

  svg {
    margin-left: 20px;
    color: ${({ theme }) => theme.color.gray999};
  }

  h1 {
    margin-left: 10px;
    font-size: ${({ theme }) => theme.title.title3};
    font-weight: 600;
    background: linear-gradient(90deg, #9ad9ea, #202879);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  margin-right: 20px;
  flex-direction: row;

  button {
    white-space: nowrap;
  }
`;

const Icons = styled.div`
  display: flex;
  align-items: center;

  svg {
    color: ${({ theme }) => theme.color.gray999};
    margin-right: 20px;
  }
`;

const Profile = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 20px;
  margin-top: 4px;

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }

  span {
    margin: 0 8px;
    padding-bottom: 3px;
    white-space: nowrap;
  }
`;

export const DefaultProfileIcon = styled(FaUserCircle)`
  width: 32px;
  height: 32px;
  margin-top: 0;
  color: ${({ theme }) => theme.color.gray999};
`;

const IconButton = styled.button`
  position: relative;
  align-items: center;
  padding-top: 2px;
  background: none;
  border: none;
  margin: 0;
  color: ${({ theme }) => theme.color.gray999};
  cursor: pointer;

  &:hover {
    svg {
      color: ${({ theme }) => theme.color.grayblack};
    }
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  display: flex;
  background: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.grayDF};
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.color.grayLight};
  }

  span {
    margin: 8px;
  }

  svg {
    margin-right: 8px;
    color: ${({ theme }) => theme.color.grayblack};
  }
`;
