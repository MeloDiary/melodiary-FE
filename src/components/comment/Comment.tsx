import React from "react";
import styled from "styled-components";
import { FaPen, FaUserCircle } from "react-icons/fa";

// /api/diaries/{diaryID}/comments
const comments = [
  {
    date: "2024-08-01",
    commentId: 1,
    content: "잘 읽었습니다 ㅎㅎ",
    userId: 1,
  },
  {
    date: "2024-08-01",
    commentId: 2,
    content: "멋진 글이에요!",
    userId: 2,
  },
  {
    date: "2024-08-01",
    commentId: 3,
    content: "감사합니다!",
    userId: 3,
  },
  {
    date: "2024-08-01",
    commentId: 4,
    content: "잘 보고 갑니다!",
    userId: 4,
  },
];

// user정보 : `/api/users/${comment.userId}`
const users = [
  {
    userID: 1,
    profileImgURL:
      null,
    nickname: "musseuk",
    emailAddress: "musseuk@example.com",
  },
  {
    userID: 2,
    profileImgURL:
      "https://i.pinimg.com/236x/db/a4/32/dba4322ad59e8555cfad93442d2c9c3c.jpg",
    nickname: "Kim",
    emailAddress: "Kim@example.com",
  },
  {
    userID: 3,
    profileImgURL:
      "https://i.pinimg.com/236x/3d/aa/a5/3daaa580c31c86277d13f55594895f8a.jpg",
    nickname: "Lee",
    emailAddress: "Lee@example.com",
  },
  {
    userID: 4,
    profileImgURL:
      "https://i.pinimg.com/236x/1c/d3/93/1cd393c81aee774ac3e0f586f7413a09.jpg",
    nickname: "Park",
    emailAddress: "Park@example.com",
  },
];

function CommentSection() {
  return (
    <CommentsContainer >
      {comments.map((comment) => {
        const user = users.find((user) => user.userID === comment.userId);

        return (
          <Comment key={comment.commentId}>
            <CommentHeader>
              <User>
                {user?.profileImgURL ? (
                  <ProfileImage src={user.profileImgURL} alt="Profile" />
                ) : (
                  <DefaultProfileIcon />
                )}
                <Username>{user?.nickname || "Unknown User"}</Username>
              </User>
              <CommentDate>{comment.date}</CommentDate>
            </CommentHeader>
            <CommentText>{comment.content}</CommentText>
            <Button>
              <button type="button">댓글달기</button>
            </Button>
          </Comment>
        );
      })}
      <CommentInputContainer>
        <CommentInput placeholder="댓글을 입력하세요." />
        <CommentButton>
          <FaPen />
        </CommentButton>
      </CommentInputContainer>
    </CommentsContainer>
  );
}

const CommentsContainer = styled.div`
  background-color: none;
  border-top: 1px solid ${({ theme }) => theme.color.grayDF};
  padding: 0 15px;
  margin-bottom: 80px;
`;

const Comment = styled.div`
  margin: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.grayDF};
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ProfileImage = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
`;

const DefaultProfileIcon = styled(FaUserCircle)`
  width: 28px;
  height: 28px;
  color: ${({ theme }) => theme.color.gray999};
`;

const Username = styled.div`
  margin-bottom: 2px;
  font-size: ${({ theme }) => theme.text.text3};
  font-weight: 500;
`;

const CommentDate = styled.div`
  color: ${({ theme }) => theme.color.gray999};
  font-size: ${({ theme }) => theme.text.text3};
`;

const CommentText = styled.div`
  margin: 8px 32px;
  font-size: ${({ theme }) => theme.text.text3};
`;

const Button = styled.div`
  button {
    margin: 8px 32px;
    border: none;
    background-color: transparent; 
    color: ${({ theme }) => theme.color.gray777};
    font-size: ${({ theme }) => theme.text.text3};
    cursor: pointer;
  }
`;

const CommentInputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.color.grayDF};
  border-radius: 4px;
  margin-bottom: 20px;

  &:focus {
    outline: none; 
    border-color: ${({ theme }) => theme.color.grayDF};
  }
`;

const CommentButton = styled.button`
  padding: 12px;
  margin-left: 5px;
  border: none;
  background-color: ${({ theme }) => theme.color.primary};
  color: ${({ theme }) => theme.color.white};
  border-radius: 4px;
  margin-bottom: 20px;
  cursor: pointer;
`;

export default CommentSection;
