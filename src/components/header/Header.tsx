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
} from "react-icons/bi";
import { CiLogout } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";
import NotificationDropdown from "../notification/NotificationDropdown";
import { useAuth } from "../../context/AuthContext";
import SearchBar from "./SearchBar";
import { useNotifications } from "../../hooks/useNotification";
import { useUserData } from "../../hooks/useUserData";
import { useUserStore } from "../../store/authStore";

function Header() {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const storedUserId = localStorage.getItem('user_id');
  const userId = storedUserId ? Number(storedUserId) : null;

  const { notifications, fetchNotifications, markAsRead } = useNotifications(userId || 0);
  const { user, loading, error } = useUserData(userId!);

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

  return (
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
          <IconButton>
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
