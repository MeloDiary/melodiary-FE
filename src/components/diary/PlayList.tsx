// Playlist.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

interface PlaylistItem {
  title: string;
  artist: string;
  date: string;
}

const PlayList = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 5;

  const playlist: PlaylistItem[] = [
    { title: '멜로다이어리', artist: '머쓱이', date: '2024.07.22' },
    { title: '멜로다이어리', artist: '머쓱이', date: '2024.07.22' },
    { title: '멜로다이어리', artist: '머쓱이', date: '2024.07.22' },
    { title: '멜로다이어리', artist: '머쓱이', date: '2024.07.22' },
    { title: '멜로다이어리', artist: '머쓱이', date: '2024.07.22' },
    { title: '멜로다이어리', artist: '머쓱이', date: '2024.07.22' },
    { title: '멜로다이어리', artist: '머쓱이', date: '2024.07.22' },
    { title: '멜로다이어리', artist: '머쓱이', date: '2024.07.22' },
    { title: '멜로다이어리', artist: '머쓱이', date: '2024.07.22' },
    { title: '멜로다이어리', artist: '머쓱이', date: '2024.07.22' },
  ];

  const totalPages = Math.ceil(playlist.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
    const selectedItems = playlist.slice(startIndex, startIndex + itemsPerPage);

    return selectedItems.map((item, index) => (
      <tr key={index}>
        <td>{item.title}</td>
        <td>{item.artist}</td>
        <td>{item.date}</td>
      </tr>
    ));
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
        <thead className='playListHeader'>
          <tr>
            <th>제목</th>
            <th>가수</th>
            <th>사용 날짜</th>
          </tr>
        </thead>
        <tbody>{renderPlaylistItems()}</tbody>
      </Table>
      <Pagination>
        <ArrowButton onClick={handlePreviousPage}>
          <IoIosArrowBack />
        </ArrowButton>
        {renderPageNumbers()}
        <ArrowButton onClick={handleNextPage}>
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
  margin: auto;
  text-align: center;
`;

const Table = styled.table`
  width: 100%;
  max-width: 700px;
  border-collapse: separate; 
  border-spacing: 0; 
  border: 1px solid ${({ theme }) => theme.color.grayDF}; 
  border-radius: 8px;
  .playListHeader th {
    border-bottom: 1px solid ${({ theme }) => theme.color.grayDF};
    font-family: ${({ theme }) => theme.fontFamily.kor};
  }
  th, td {
    padding: 12px 10px;
    border: none;
    font-family: ${({ theme }) => theme.fontFamily.kor};
    font-size: 14px;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
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
