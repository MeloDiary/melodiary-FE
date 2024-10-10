import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaPen, FaUserCircle } from "react-icons/fa";
import { GrUpdate } from "react-icons/gr";
import { useComments } from "../../hooks/useComment";
import { IComment } from "../../models/comment.model";
import { fetchComments } from "../../api/comment.api";

interface CommentSectionProps {
  diaryId: number;
  diaryUserId: number;
  backgroundColor?: string;
  setCommentCount?: (count: number) => void;
}

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);

  const formattedDate = date
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\./g, ".")
    .replace(/\s/g, "")
    .replace(/\.$/, "");

  const formattedTime = date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${formattedDate} ${formattedTime}`;
};

const CommentSection: React.FC<CommentSectionProps> = ({
  diaryId,
  diaryUserId,
  backgroundColor,
  setCommentCount,
}) => {
  const {
    comments,
    loading,
    error,
    addComment,
    editComment,
    removeComment,
    setComments,
  } = useComments(diaryId);

  const [newComment, setNewComment] = useState("");
  const [mentionedUser, setMentionedUser] = useState<{ id: number } | null>(
    null
  );

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);

  const currentUserId = parseInt(localStorage.getItem("user_id") || "", 10);

  useEffect(() => {
    if (setCommentCount) {
      setCommentCount(comments.length);
    }
  }, [comments.length, setCommentCount]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const latestComments = await fetchComments(diaryId);
      if (latestComments.length !== comments.length) {
        setComments(latestComments);
        if (setCommentCount) {
          setCommentCount(latestComments.length);
        }
      }
    }, 50000);

    return () => clearInterval(intervalId);
  }, [comments.length, diaryId, setCommentCount]);

  const handleAddComment = async () => {
    if (editMode && editingCommentId !== null) {
      await editComment(editingCommentId, newComment);

      const latestComments = await fetchComments(diaryId);
      const sortedComments = latestComments.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      setComments(sortedComments);

      setEditingCommentId(null);
      setEditMode(false);
    } else {
      await addComment(newComment, mentionedUser?.id);

      const latestComments = await fetchComments(diaryId);
      const sortedComments = latestComments.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      setComments(sortedComments);
    }

    setNewComment("");
    setMentionedUser(null);
  };

  const startEditing = (comment_id: number, content: string) => {
    setEditingCommentId(comment_id);
    setNewComment(content);
    setEditMode(true);
  };

  const handleMentionClick = (userId: number, nickName: string) => {
    setMentionedUser({ id: userId });
    setNewComment(`@${nickName} `);
  };

  const parseCommentText = (text: string = '') => {
    const mentionRegex = /@[\uAC00-\uD7A3a-zA-Z]+/g;
    const parts = text.split(mentionRegex);
    const mentions = text.match(mentionRegex) || [];
  
    return parts.reduce((acc, part, index) => {
      acc.push(<span key={`part-${index}`}>{part}</span>);
      if (mentions[index]) {
        acc.push(
          <MentionSpan key={`mention-${index}`} backgroundColor={backgroundColor}>
            {mentions[index]}
          </MentionSpan>
        );
      }
      return acc;
    }, [] as React.ReactNode[]);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <CommentsContainer>
      {Array.isArray(comments) && comments.length > 0 ? (
        comments.map((comment: IComment) => (
          <Comment key={comment.comment_id}>
            <CommentHeader>
              <User>
                {comment.writer_user_profile?.profile_img_url ? (
                  <ProfileImage
                    src={comment.writer_user_profile.profile_img_url}
                    alt="프로필 이미지"
                  />
                ) : (
                  <DefaultProfileIcon />
                )}
                <UserId>{comment.writer_user_profile?.nickname}</UserId>
              </User>
              <CommentDate>{formatDateTime(comment?.created_at)}</CommentDate>
            </CommentHeader>
            <CommentText>{parseCommentText(comment.content)}</CommentText>
            <Actions>
              {currentUserId === diaryUserId && (
                <Button
                  backgroundColor={backgroundColor}
                  onClick={() => removeComment(comment.comment_id)}
                >
                  삭제
                </Button>
              )}
              {currentUserId === comment.writer_user_profile?.user_id && (
                <Button
                  backgroundColor={backgroundColor}
                  onClick={() =>
                    startEditing(comment.comment_id, comment.content)
                  }
                >
                  수정하기
                </Button>
              )}
              <Button
                backgroundColor={backgroundColor}
                onClick={() =>
                  handleMentionClick(
                    comment.writer_user_profile.user_id,
                    comment.writer_user_profile.nickname
                  )
                }
              >
                답글 달기
              </Button>
            </Actions>
          </Comment>
        ))
      ) : (
        <div></div>
      )}
      <CommentInputContainer>
        <CommentInput
          placeholder="댓글을 입력하세요."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <CommentButton onClick={handleAddComment}>
          {editMode ? (
            <GrUpdate />
          ) : (
            <>
              <FaPen />
            </>
          )}
        </CommentButton>
      </CommentInputContainer>
    </CommentsContainer>
  );
};

export default CommentSection;

const CommentsContainer = styled.div`
  background-color: none;
  border-top: 1px solid ${({ theme }) => theme.color.grayDF};
  min-height: 400px;
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

const DefaultProfileIcon = styled(FaUserCircle)`
  width: 28px;
  height: 28px;
  color: ${({ theme }) => theme.color.gray999};
`;

const ProfileImage = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
`;

const UserId = styled.div`
  margin-bottom: 2px;
  font-size: ${({ theme }) => theme.text.text3};
  font-weight: 500;
  color: ${({ theme }) => theme.color.black};
`;

const CommentDate = styled.div`
  color: ${({ theme }) => theme.color.gray999};
  font-size: ${({ theme }) => theme.text.text3};
`;

const CommentText = styled.div`
  margin: 8px 32px;
  font-size: ${({ theme }) => theme.text.text3};
`;

const MentionSpan = styled.span<{ backgroundColor?: string }>`
  background-color: ${({ backgroundColor, theme }) =>
    backgroundColor
      ? theme.diaryColor[backgroundColor]?.tag
      : theme.color.grayDF};
  color: ${({ theme }) => theme.color.black};
  padding: 0 4px;
  border-radius: 4px;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin: 8px 32px;
`;

const Button = styled.button<{ backgroundColor?: string }>`
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.color.gray999};
  font-size: ${({ theme }) => theme.text.text3};
  cursor: pointer;
  border-radius: 4px;
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
  svg {
    padding-top: 2px;
  }
`;
