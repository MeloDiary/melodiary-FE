import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import background from '../assets/images/background.png';
import { FcGoogle } from "react-icons/fc";
import { SiNaver } from "react-icons/si";
import { RiKakaoTalkFill } from "react-icons/ri";
import { GOOGLE_LOGIN_URL, KAKAO_LOGIN_URL, NAVER_LOGIN_URL, FACEBOOK_LOGIN_URL } from '../config';
import { FaFacebook } from "react-icons/fa"; 
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const Login = () => {
  const {isAuthenticated} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const userId =  localStorage.getItem('user_id');
      navigate(`/home/${userId}`);
    }
  }, [isAuthenticated, navigate]);

  return (
    <LoginWrapper>
      <ContentWrapper>
        <ButtonContainer>
          <LoginTitle>LOGIN</LoginTitle>
          <a href={GOOGLE_LOGIN_URL}>
            <Button className="google">
              <IconWrapper><FcGoogle /></IconWrapper>
              Google로 시작하기
            </Button>
          </a>
          <a href={KAKAO_LOGIN_URL}>
            <Button className="kakao">
              <IconWrapper><RiKakaoTalkFill /></IconWrapper>
              Kakao로 시작하기
            </Button>
          </a>
          <a href={NAVER_LOGIN_URL}>
            <Button className="naver">
              <IconWrapper><SiNaver/></IconWrapper>
              Naver로 시작하기
            </Button>
          </a>
          <LoginLink >아직 계정이 없으신가요? <Link to='/join' className='loginBtn'>회원가입</Link></LoginLink>
        </ButtonContainer>
      </ContentWrapper>
    </LoginWrapper>
  )
};

export default Login;

const LoginWrapper = styled.div`
  height: 100vh;
  background-image: url(${ background});
  background-size: cover;
  background-repeat: no-repeat; 
  background-position: center;
  background-attachment: fixed;   
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;  
  justify-content: center;
  height:92vh;
  padding-left: 5%;
`;

const LoginTitle = styled.h1`
  margin-bottom: 0.5rem;
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  width: 300px;
  height: 50px;
  padding-left:15px;
  border: none;
  border-radius: 5px;
  font-family: ${({ theme }) => theme.fontFamily.kor};
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.3s;
  cursor: pointer;

  &.google {
    background-color: ${({ theme }) => theme.color.white};
    color: ${({ theme }) => theme.color.black};
    border: 1px solid ${({ theme }) => theme.color.grayDF};;
  }
  &.google:hover {
    background-color: #f1f1f1;
  }
  &.kakao {
    background-color: #ffe812;
    color: #3c1e1e;
  }
  &.kakao:hover {
    background-color: #ffd700;
  }
  &.naver {
    background-color: #03c75a;
    color: ${({ theme }) => theme.color.white};
  }
  &.naver:hover {
    background-color: #02b04a;
  }
  &.facebook { /* Facebook 버튼 스타일 추가 */
    background-color: #3b5998;
    color: ${({ theme }) => theme.color.white};
  }
  &.facebook:hover {
    background-color: #355089;
  }
`;

const IconWrapper = styled.div`
  margin-right: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginLink = styled.div`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.color.gray777};
  .loginBtn{
    color: ${({ theme }) => theme.color.gray777};
    text-decoration: underline;
  }
`;
