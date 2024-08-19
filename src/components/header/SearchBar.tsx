import React, { useState } from 'react';
import styled from 'styled-components';
import { BiSearch } from 'react-icons/bi';
import { useSearchUser } from '../../hooks/useSearchResult';
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../customAlert/CustomAlert';

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();
  const { handleSearch } = useSearchUser(); 
  const [alertVisible, setAlertVisible] = useState<boolean>(false);


  const handleSearchSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      let result;
      if (searchQuery.includes('@')) {
        result = await handleSearch(undefined, searchQuery);
      } else {
        result = await handleSearch(searchQuery); 
      }

      if (result) {
        navigate(`/home/${result.user_id}`, {
          // 검색시 홈에서의 정보 확인을 위한 부분입니다! Calander API를 고려해서 주석 처리 해두겠습니다
          // state: { nickname: result.nickname, profileImgUrl: result.profile_img_url }
        });
      } else {
        setAlertVisible(true); 
      }
      
      setSearchQuery('');
    }
  };

  return (
    <>
      {alertVisible && (
        <CustomAlert 
          message="존재하지 않는 유저입니다." 
          subMessage="올바른 닉네임 / 이메일을 입력 해주세요."
          onClose={() => setAlertVisible(false)} 
        />
      )}
      <SearchForm onSubmit={handleSearchSubmit}>
        <BiSearch size={20} />
        <SearchInput
          type="text"
          placeholder="Search mate by nickname or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchForm>
    </>
  );
};

export default SearchBar;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  padding: 8px 16px; /* 기존 padding 값을 조정 */
  margin-right: 20px;
  border: 1px solid ${({ theme }) => theme.color.grayDF};
  border-radius: 8px;
  width: 100%; /* 필요한 경우 width 설정 */
  max-width: 400px; /* 원하는 최대 너비 설정 */
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
  min-width: 300px;
  width: 100%;
  overflow: hidden; /* 추가 */
  text-overflow: ellipsis; /* 긴 텍스트가 잘리지 않고 말줄임표로 표시되도록 함 */
`;

