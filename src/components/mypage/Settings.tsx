import styled from 'styled-components';
import Button from '../button/Button';
import { FiInfo } from "react-icons/fi";
import { useState } from 'react';
import { useMyPage } from '../../hooks/useMyPage';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [nickname, setNickname] = useState<string>("");
  const { 
    isNicknameAvailable, 
    hasCheckedNickname,
    setHasCheckedNickname,
    fetchCheckNicknameAvailability,
    fetchChangeNicknameData,
    fetchDeleteUserAccount,
    deleteSuccess 
  } = useMyPage();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const storedUserId = localStorage.getItem('user_id');
  const userId = storedUserId ? Number(storedUserId) : null;
  
  // 닉네임 중복확인 시 상태 업데이트 & 중복확인 상태 초기화
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    setHasCheckedNickname(false);
  };

  // 닉네임 중복확인 BTN
  const handleClickCheckBtn = async () => {
    await fetchCheckNicknameAvailability(nickname);
    setHasCheckedNickname(true);
  };

  // 닉네임 변경 BTN
  const handleClickChangeBtn = async () => {
    if (!hasCheckedNickname) {
      alert("닉네임 중복 확인을 먼저 해주세요.");
      return;
    }

    if (isNicknameAvailable) {
      await fetchChangeNicknameData(userId!, nickname);
      alert("닉네임 변경이 완료되었습니다.");
      window.location.reload();
    } else {
      alert("변경할 닉네임을 입력해주세요.");
    }
  };

  // 회원 탈퇴 BTN
  const handleDeleteAccountBtn = () => {
    if (window.confirm('정말 탈퇴하시겠습니까?')) {
      const storedUserId = localStorage.getItem('user_id');
      const userId = storedUserId ? Number(storedUserId) : null;
      if (userId) {
        fetchDeleteUserAccount(userId);
        if (deleteSuccess) {
          logout();
          navigate("/");
        }
      }
    }
  };

  return (
    <SettingsWrapper>
      <ChangeNickname>
        <Title>닉네임 변경하기</Title>
        <NicknameBox>
          <NicknameInputBox>
            <input
              type="text"
              value={nickname}
              onChange={handleNicknameChange}
            />
            <Button
              className='check-btn'
              size={'short'}
              schema={'gray'}
              onClick={handleClickCheckBtn}
            >중복확인</Button>
          </NicknameInputBox>
          {isNicknameAvailable === null && 
            <span className='error-check'>2 ~ 14자로 입력해주세요.</span>
          }
          {isNicknameAvailable === true && 
            <span className='error-check true'>사용 가능한 닉네임입니다.</span>
          }
          {isNicknameAvailable === false && 
            <span className='error-check false'>이미 사용 중인 닉네임입니다.</span>
          }
          <Button
            className='change-btn'
            size="long" 
            schema="white"
            onClick={handleClickChangeBtn}
          >변경하기</Button>
        </NicknameBox>
      </ChangeNickname>
      <DeleteAccount>
        <Title>회원탈퇴</Title>
        <AccountBox>
          <span
            className='delete-btn'
            onClick={handleDeleteAccountBtn}
          >회원탈퇴</span>
          <div className="delete-desc">
            <FiInfo />
            <span>모든 데이터가 삭제됩니다.</span>
          </div>
        </AccountBox>
      </DeleteAccount>
    </SettingsWrapper>
  )
};

export default Settings;

const SettingsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 564px;
`;

const ChangeNickname = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fontFamily.kor};
  font-size: ${({ theme }) => theme.title.title3};
  font-weight: 600;
`;

const NicknameBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 6px;
  width: 100%;

  .change-btn {
    padding: 8px 150px;
    border-radius: 8px;
    font-weight: 600;
    
    &:hover {
      color: ${({ theme }) => theme.color.white};
      background-color: ${({ theme }) => theme.color.primary};
    }
  }
  
  .error-check {
    margin-left: 4px;
    margin-bottom: 6px;
    color: ${({ theme }) => theme.color.gray777};
    font-family: ${({ theme }) => theme.fontFamily.kor};
    font-size: ${({ theme }) => theme.text.text2};

    &.true {
      color: ${({ theme }) => theme.color.primary};
    }

    &.false {
      color: red;
    }
  }
`;

const NicknameInputBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  width: 100%;

  input {
    width: 357px;
    padding: 8px 10px;
    color: ${({ theme }) => theme.color.black};
    border-radius: 6px;
    border: 1px solid ${({ theme }) => theme.color.grayDF};
    outline: none;

    &:focus {
      border: 1px solid ${({ theme }) => theme.color.primary};
    }
  }

  .check-btn {
    padding: 10px 18px;

    &:hover {
      background-color: ${({ theme }) => theme.color.grayDF};
    }
  }
`;

const DeleteAccount = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
`;

const AccountBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  width: 100%;
  color: ${({ theme }) => theme.color.gray777};

  .delete-btn {
    font-size: ${({ theme }) => theme.text.text2};
    text-decoration: underline;
    cursor: pointer;
  }

  .delete-desc {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;

    svg {
      font-size: 14px;
    }

    span {
      font-size: ${({ theme }) => theme.text.text2};
    }
  }
`;
