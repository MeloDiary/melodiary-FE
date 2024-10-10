import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { BiHeadphone } from "react-icons/bi";
import { registerNickname } from '../api/auth.api';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const NickName = () => {
  const [nickname, setNickname] = useState<string>(''); // 닉네임 상태 관리
  const { login: setAuthToken } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isSignupComplete, setIsSignupComplete } = useAuth();

  useEffect(() => {
    if (!isSignupComplete) {
      navigate('/'); // 접근을 막고 싶은 페이지로 리다이렉트
    }
    // 컴포넌트가 언마운트될 때 상태 초기화
    return () => {
      setIsSignupComplete(false);
    };
  }, [isSignupComplete, navigate, setIsSignupComplete]);

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
    setErrorMessage(null);
  };

  const handleRegisterNickname = async () => {
    if (nickname.length < 2 || nickname.length > 14) {
      alert('닉네임은 2자에서 14자 사이여야 합니다.');
      return;
    }
    const userId = localStorage.getItem('user_id');
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    try {
      if (userId && accessToken && refreshToken) {
        const response = await registerNickname(userId, nickname);
        console.log('닉네임 등록 성공:', response.data);
        setAuthToken(accessToken, Number(userId), refreshToken );
        localStorage.setItem("firstVisitAfterNickname", "true");

        navigate(`/home/${userId}`);
        window.location.reload(); 
      } 
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setErrorMessage("이미 존재하는 닉네임입니다.");
      } else {
        setErrorMessage("닉네임 등록에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };
  return (
    <PageWrapper>
      <ContentWrapper>
        <Logo>
          <BiHeadphone size={24} />
          <h3>MeloDiary&nbsp;</h3> 에 오신 것을 환영합니다!
        </Logo>
        <WelcomeMessage>
          여러분만의 닉네임을 입력하고 시작해보세요.
        </WelcomeMessage>
        <InputWrapper>
          <NicknameInput placeholder="닉네임을 입력하세요"  
            value={nickname} 
            onChange={handleNicknameChange} 
            isError={!!errorMessage}  />
           <InputInfo isError={!!errorMessage}>
            {errorMessage || "2 ~ 14자로 입력해주세요."}
          </InputInfo>
        </InputWrapper>
        <EnterButton onClick={handleRegisterNickname}>입장하기</EnterButton>
      </ContentWrapper>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: ${({ theme }) => theme.color.white};
  border-radius: 10px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  font-family: ${({ theme }) => theme.fontFamily.kor};
  svg {
    color: ${({ theme }) => theme.color.gray999};
  }
  h3 {
    margin-left: 10px;
    background: linear-gradient(90deg, #9ad9ea, #202879);
    background-clip: text;
    color: transparent;
    font-family: ${({ theme }) => theme.fontFamily.eng};
    font-size: ${({ theme }) => theme.title.title3};
    font-weight: bold;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const WelcomeMessage = styled.p`
  margin-bottom: 20px;
  text-align: center;  
  font-size: 1rem;
  color: ${({ theme }) => theme.color.grayblack};
  font-family: ${({ theme }) => theme.fontFamily.kor};
`;

const InputWrapper = styled.div`
  width: 100%;
  margin-bottom: 20px;
  text-align: center;
`;

const NicknameInput = styled.input<{ isError: boolean }>`
  width: 100%;
  padding: 10px;
  margin-bottom: 5px;
  border: 1px solid ${({ isError, theme }) => isError ? '#fb122f' : theme.color.grayDF};
  border-radius: 5px;
  font-size: 1rem;
  font-family: ${({ theme }) => theme.fontFamily.kor};
  text-align: center;
`;

const InputInfo = styled.p<{ isError: boolean }>`
  font-size: 0.8rem;
  color: ${({ isError, theme }) => isError ? '#fb122f': theme.color.gray777};
  text-align: center;
  font-family: ${({ theme }) => theme.fontFamily.kor};
`;

const EnterButton = styled.button`
  width: 100%;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.color.primary};
  border-radius: 5px;
  background-color: ${({ theme }) => theme.color.white};
  font-size: 1rem;
  color: ${({ theme }) => theme.color.primary};
  cursor: pointer;
  font-family: ${({ theme }) => theme.fontFamily.kor};
  &:hover {
    color: ${({ theme }) => theme.color.white};
    background-color: ${({ theme }) => theme.color.primary};
    border: 1px solid ${({ theme }) => theme.color.primary};
  }
`;

export default NickName;
