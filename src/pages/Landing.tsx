import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion} from 'framer-motion';
import background from '../assets/images/background.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const openJoinPage = () => {
    navigate('/join');
  };

  useEffect(() => {
    if (isAuthenticated) {
      const userId =  localStorage.getItem('user_id');
      navigate(`/home/${userId}`);
    }
  }, [isAuthenticated, navigate]);

  return(
    <LandingWrapper>
      <LandingContainer>
        <TextContainer>
          <h1>
            <Highlight><span>Record</span></Highlight> your day<br />
            with music.
          </h1>
          <p>
            매일 일기를 작성하며 그날의 기분을 음악과 이미지로 표현하고,<br />
            친구와 일기 및 음악 목록을 공유할 수 있습니다.
          </p>
          <button onClick={openJoinPage} >Write your own diary</button>
        </TextContainer>
      </LandingContainer>
    </LandingWrapper> 
  )
};

export default Landing;

const LandingWrapper = styled(motion.div)`
  height: 100vh;
  background-image: url(${ background });
  background-size: cover;
  background-repeat: no-repeat; 
  background-position: center;
  background-attachment: fixed; 
`;

const LandingContainer = styled.main`
  display: flex;
  justify-content: flex-start; 
  flex-direction: row;
  align-items: center;
  height:92vh;
  padding-left: 5%; 
  color: #000;

  h1 {
    margin-bottom: 20px;
    font-size: 64px;
    font-weight: 600;
  }

  p {
    margin-bottom: 1em;
    text-align: left;
    font-size: ${({ theme }) => theme.text.text1};
    font-family: ${({ theme }) => theme.fontFamily.kor};
    line-height: 170%;
    color: ${({ theme }) => theme.color.gray777};
  }

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: ${({ theme }) => theme.color.coolblue};
    font-size: ${({ theme }) => theme.text.text1};
    color: ${({ theme }) => theme.color.white};
    cursor: pointer;
  }
`;

const TextContainer = styled.div`
  text-align: left; 
`;

const Highlight = styled.span`
  display: inline-block;
  position: relative;

  span {
    padding-left: 0.5rem;
    position: relative;
    z-index: 1;
  }

  &::before {
    position: absolute;
    content: '';
    left: 0;
    top: 50%;
    z-index: 0;
    width: 90%;
    height: 2.5rem; 
    margin-top: 1.2rem;
    transform: translateY(-50%);
    background-color: ${({ theme }) => theme.color.lightcoolblue};
  }
`;