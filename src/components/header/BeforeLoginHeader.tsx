import React from 'react';
import styled from 'styled-components';
import { FiGithub } from "react-icons/fi";
import { BiHeadphone } from "react-icons/bi";
import { Link } from 'react-router-dom';

interface BeforeLoginHeaderProps {
  isNicknamePage?: boolean;
}

const LandingHeader: React.FC<BeforeLoginHeaderProps> = ({ isNicknamePage }) => {
  if (isNicknamePage) {
    return(
      <HeaderContainer>
          <Logo>
            <BiHeadphone size={24} />
            <h1>MeloDiary </h1> 
          </Logo>
      </HeaderContainer>
    );
  }
  return(
    <HeaderContainer>
      <Link to="/">
        <Logo>
          <BiHeadphone size={24} />
          <h1>MeloDiary </h1> 
        </Logo>
      </Link>
      <RightSection>
        <Link to="/login">
        <LoginButton > LOGIN</LoginButton>
        </Link>
        <a href="https://github.com/MeloDiary" target="_blank" rel="MeloDiary">
          <FiGithub className='github' />
        </a>
      </RightSection>
    </HeaderContainer>
  );
};

export default LandingHeader;

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;  
  align-items: center;
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  background-color: transparent;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  svg {
    margin-left: 20px;
    color: ${({ theme }) => theme.color.gray999};
  }

  h1 {
    margin-left: 10px;
    background: linear-gradient(90deg, #9ad9ea, #202879);
    background-clip: text;
    color: transparent;
    font-size: ${({ theme }) => theme.title.title3};
    font-weight: 600;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
  gap: 20px;

  .github {
    width:24px;
    height:24px;
    color: ${({ theme }) => theme.color.gray777}
  }
`;

const LoginButton = styled.button`
  border: none;
  background: none;
  font-size: 1em;
  cursor: pointer;
  color: ${({ theme }) => theme.color.gray777}
`;
