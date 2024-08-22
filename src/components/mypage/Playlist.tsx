import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { getPlayList } from '../../api/home.api';
import { Link } from 'react-router-dom';

interface PlaylistItem {
  diaryId: number;
  title: string;
  artist: string;
  date: string;
}

const PlayList = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage: number = 5;
  const  userId = localStorage.getItem("user_id");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllPlaylistData = async () => {
      try {
        if (userId) {
          let allMusics: PlaylistItem[] = [];
          let page = 1;
          let data;
          
          do {
            data = await getPlayList(userId, page, itemsPerPage);
            if (data && data.musics && Array.isArray(data.musics)) {
              const formattedPlaylist = data.musics.map((music: any) => ({
                diaryId: music.diary_id,
                title: music.title,
                artist: music.artist,
                date: new Date(music.created_at).toLocaleDateString(),
              }));
              allMusics = [...allMusics, ...formattedPlaylist];
              page++;
            }
          } while (data && data.musics && data.musics.length > 0);

          setPlaylist(allMusics);
          
          // 총 페이지 수 계산
          const totalItems = allMusics.length;
          const calculatedTotalPages = Math.ceil(totalItems / itemsPerPage);
          setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          setError('해당 유저를 찾을 수 없습니다.');
        } else if (error.response?.status === 500) {
          setError('서버에 문제가 발생했습니다. 나중에 다시 시도해주세요.');
        } else {
          setError('음악 정보를 가져오는 중 오류가 발생했습니다.');
        }
        setPlaylist([]);
        setTotalPages(1);
      }
    };

    fetchAllPlaylistData();
  }, [userId]);

  // useEffect(() => {
  //   // 더미 데이터 생성
  //   const dummyData: PlaylistItem[] = [
  //     { title: 'Supernova', artist: 'aespa', date: '2024.07.17' },
  //     { title: 'How Sweet', artist: 'NewJeans', date: '2024.07.16' },
  //     { title: 'Small girl (feat. 도경수(D.O.))', artist: '이영지', date: '2024.07.15' },
  //     { title: 'Supernatural', artist: 'NewJeans', date: '2024.07.14' },
  //     { title: 'Sticky', artist: 'KISS OF LIFE', date: '2024.07.13' },
  //     { title: 'Cupid', artist: 'FIFTY FIFTY', date: '2024.07.12' },
  //     { title: 'Spicy', artist: 'aespa', date: '2024.07.11' },
  //   ];

  //   setPlaylist(dummyData);
  // }, []);

 
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber !== currentPage && pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderPlaylistItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToShow = playlist.slice(startIndex, endIndex);

    if (itemsToShow.length === 0 && currentPage === 1) {
      // 플레이리스트에 항목이 없는 경우 메시지 표시
      return (null);
    } else {
      // 플레이리스트에 항목이 있을 경우와 빈칸이 있는 경우
      const emptyItems = Array.from({ length: itemsPerPage - itemsToShow.length }).map((_, index) => (
        <tr key={`empty-${index}`} style={{ backgroundColor: '#fcfcfc' }}>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
      ));

      return [...itemsToShow.map((item, index) => (
        <tr key={index}>
        <td>{item.title}</td>
        <td>{item.artist}</td>
        <td>{item.date}</td>
        <td className="view-link"> <StyledLink to={`/diary/${item.diaryId}`}>보러가기</StyledLink></td>
      </tr>
      )), ...emptyItems];
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <PageNumber
          key={i}
          onClick={() => handlePageChange(i)}
          isActive={i === currentPage}
        >
          {i}
        </PageNumber>
      );
    }
    return pageNumbers;
  };

  return (
    <PlaylistContainer>
      <Table>
        <thead>
          <tr>
            <th>제목</th>
            <th>아티스트</th>
            <th>사용 날짜</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{renderPlaylistItems()}</tbody>
      </Table>
      <Pagination>
        <ArrowButton onClick={handlePreviousPage} disabled={currentPage === 1}>
          <IoIosArrowBack />
        </ArrowButton>
        {renderPageNumbers()}
        <ArrowButton onClick={handleNextPage} disabled={currentPage >= totalPages}>
          <IoIosArrowForward />
        </ArrowButton>
      </Pagination>
    </PlaylistContainer>
  );
};

export default PlayList;

const PlaylistContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1000px;
  margin: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate; 
  border-spacing: 0; 
  border: none;
  table-layout: fixed; 
  height: calc(40px * 6); 
  .playListHeader th {
    border-bottom: 1px solid ${({ theme }) => theme.color.gray777};
    font-family: ${({ theme }) => theme.fontFamily.kor};
  }
  th, td {
    height: 46px;
    padding: 12px 10px;
    font-family: ${({ theme }) => theme.fontFamily.kor};
    text-align: left;
    font-size: 14px;
    border-bottom: 1px solid #e0e0e0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  th {
    color: ${({ theme }) => theme.color.gray777};
    }
  th:nth-child(1), td:nth-child(1) {
    width: 40%; 
  }
  th:nth-child(2), td:nth-child(2) {
    width: 30%; 
  }
  th:nth-child(3), td:nth-child(3) {
    width: 30%; 
  }

  th:nth-child(4), td:nth-child(4) {
    width: 10%; 
  }
  
  .view-link {
    color: ${({ theme }) => theme.color.gray999};
  }
`;

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.color.gray999}; 
  text-decoration: none; 
  
  position: relative; 

  &::after {
    content: ''; 
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1.5px; 
    height: 1px; 
    background-color: ${({ theme }) => theme.color.gray999}; 
    transform-origin: bottom center;
    transform: scaleX(1); 
  }
    &:hover {
    text-decoration: none; 
    color: ${({ theme }) => theme.color.gray777}; 
  }
`;



const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
`;
const ArrowButton = styled.button`
  display: flex;
  align-items: center;
  margin: 0 3px 0 3px;
  border: none;
  background: none;
  font-size: 1.3rem;
  cursor: pointer;
  color: ${({ theme }) => theme.color.grayblack}; 
  &:disabled {
    color: ${({ theme }) => theme.color.grayDF};
    cursor: default;
  }
`;

const PageNumber = styled.button<{ isActive: boolean }>`
  width: 28px;
  height: 28px;  
  margin: 0 5px; 
  padding-bottom: 2px;
  border: none;
  border-radius: 50px;
  background-color: ${({ isActive }) => (isActive ? ({ theme }) => theme.color.lightblue : ({ theme }) => theme.color.white )};
  color: ${({ isActive }) => (isActive ? ({ theme }) => theme.color.white : '#000')};
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.color.lightblue30};
    color: #000;
  }
`;
