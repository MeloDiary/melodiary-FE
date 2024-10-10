import styled from 'styled-components';
import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar';
import BeforeLoginHeader from '../header/BeforeLoginHeader';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const {isAuthenticated} = useAuth();
  const location = useLocation();
  
  // 닉네임 페이지 경로 확인
  const isNicknamePage = location.pathname === '/nickname'

  return (
    <LayoutWrapper>
      {isAuthenticated ? ( 
        <>
          <Header />
          <MainLayout>
            <Sidebar />
            <MainContent>
              {children}
            </MainContent>
          </MainLayout>
        </>
      ) : (
        <>
        <BeforeLoginHeader isNicknamePage={isNicknamePage} />
        <main>
          {children}
        </main>
        </>
      )}
    </LayoutWrapper>
  );
};

export default Layout;

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const MainLayout = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  /* height: calc(100vh - 64px); */
  height: 100%;

  main {
    width: 100%;
  }
`;

const MainContent = styled.div`
  width: 100%;
  height: 100%;
  border-left: 1px solid ${({ theme }) => theme.color.grayDF};
`;