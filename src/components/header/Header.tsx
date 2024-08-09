import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Button from "../button/Button";
import { Link, useNavigate } from "react-router-dom";
import {
  BiBell,
  BiEdit,
  BiHeadphone,
  BiHelpCircle,
  BiSolidChevronDown,
  BiSearch,
} from "react-icons/bi";
import { CiLogout } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";
import NotificationDropdown from "../notification/NotificationDropdown";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const {isAuthenticated, logout} = useAuth();
  const navigate = useNavigate();

  const onClickLogout = () => {
    logout();
    navigate('/');
  };

  const user = {
    username: "User",
    profileImage: null,
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      profileDropdownRef.current &&
      !profileDropdownRef.current.contains(event.target as Node)
    ) {
      setIsProfileDropdownOpen(false);
    }
    if (
      notificationDropdownRef.current &&
      !notificationDropdownRef.current.contains(event.target as Node)
    ) {
      setIsNotificationDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const notifications = [
    //알림 api 연결 전 더미데이터 입니다.
    {
      id: 1,
      content: "김머쓱님이 회원님에게 친구 요청을 보냈습니다.",
      diaryId: 1,
      category: "friend",
      date: "2024-07-26",
    },
  ];

  return (
    <HeaderWrapper>
      <Link to="/home">
        <Logo>
          <BiHeadphone size={24} />
          <h1>MeloDiary</h1>
        </Logo>
      </Link>
      <Container>
        <SearchContainer>
          <BiSearch size={20} />
          <SearchInput type="text" placeholder="Search mate" />
        </SearchContainer>
        <ButtonContainer>
          <Link to="/writediary">
            <Button size="medium" schema="primary">
              <BiEdit size={20} /> Create Diary
            </Button>
          </Link>
        </ButtonContainer>
        <Icons>
          <IconButton>
            <BiHelpCircle size={24} />
          </IconButton>
          <IconButton onClick={toggleNotificationDropdown}>
            <BiBell size={24} />
            {isNotificationDropdownOpen && (
              <NotificationDropdown
                ref={notificationDropdownRef}
                notifications={notifications}
              />
            )}
          </IconButton>
        </Icons>
        <Profile ref={profileDropdownRef}>
          <Link to="/mypage">
            {user.profileImage ? (
              <img src={user.profileImage} alt="profile" />
            ) : (
              <DefaultProfileIcon size={32} />
            )}
          </Link>
          <span>{user.username}</span>
          <IconButton onClick={toggleProfileDropdown}>
            <BiSolidChevronDown size={24} />
          </IconButton>
          {isProfileDropdownOpen && (
            <Dropdown>
              <DropdownItem onClick={onClickLogout}>
                <CiLogout size={20}/>
                LOGOUT
              </DropdownItem>
            </Dropdown>
          )}
        </Profile>
      </Container>
    </HeaderWrapper>
  );
}

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

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 100px 8px 20px;
  margin-right: 20px;
  border: 1px solid ${({ theme }) => theme.color.grayDF};
  border-radius: 8px;
  svg {
    color: ${({ theme }) => theme.color.gray999};
  }
`;

const SearchInput = styled.input`
  flex-grow: 1;
  margin-left: 8px;
  border: none;
  background: none;
  outline: none;
  min-width: 100px;
`;

const ButtonContainer = styled.div`
  display: flex;
  margin-right: 20px;
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
    padding-bottom: 4px;
  }
`;

const DefaultProfileIcon = styled(FaUserCircle)`
  width: 32px;
  height: 32px;
  margin-top: 2px;
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

export default Header;
