import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CommentSection from "../comment/Comment";
import {
  FaHeart,
  FaRegHeart,
  FaUserCircle,
  FaRegCommentDots,
} from "react-icons/fa";
import { DiaryItemProps, DiarySummaryProps } from "./DiaryItem";
import { useLikeStatus } from "../../hooks/useLikeStatus";
import { fetchComments } from "../../api/comment.api";

interface DiaryFooterProps extends DiaryItemProps {
  background_color: string;
}

const DiaryFooter: React.FC<DiaryFooterProps> = ({
  diary,
  isSummary = false,
  isExpanded,
  background_color
}) => {
  const { userHasLiked, likeCount, handleLikeClick, likedUsers } = useLikeStatus(
    diary.id,
    diary.user_profile.user_id, 
    diary.liked,
    diary.like_count || 0
  );

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [commentCount, setCommentCount] = useState<number>(0);

  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const comments = await fetchComments(diary.id); // 댓글을 가져오는 API 호출
        setCommentCount(comments.length); // 댓글 수 설정
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchCommentCount();
  }, [diary.id]);

  return (
    <>
      <SummaryFooter isSummary={isSummary}>
        <DiarySpan>
          <span
            className="heart"
            onMouseEnter={() => setIsModalOpen(true)}
            onMouseLeave={() => setIsModalOpen(false)}
            onClick={(event) => {
              event.stopPropagation(); 
              handleLikeClick();
            }}
          >
            {userHasLiked ? <FaHeart size={20} /> : <FaRegHeart size={22} />}{" "}
            {likeCount}
          </span>
          <span className="comment">
            <FaRegCommentDots size={20} /> {commentCount}
          </span>
        </DiarySpan>
      </SummaryFooter>

      {!isSummary && isExpanded && (
        <DiaryComment>
          <DiarySpan>
            <span
              className="heart"
              onClick={handleLikeClick} // 좋아요 클릭 처리
              onMouseEnter={() => setIsModalOpen(true)}
              onMouseLeave={() => setIsModalOpen(false)}
            >
              {userHasLiked ? <FaHeart size={20} /> : <FaRegHeart size={20} />}{" "}
              {likeCount}
            </span>
            <span className="comment">
              <FaRegCommentDots size={20} /> {commentCount}
            </span>
          </DiarySpan>
          {isModalOpen && (
            <LikesModal>
              <LikedSpan>
                <span className="heart" onClick={handleLikeClick}>
                  <FaHeart
                    size={22}
                    color={userHasLiked ? "#ff5c5c" : "#ccc"}
                  />{" "}
                </span>
                <h4>Liked</h4>
              </LikedSpan>
              <ul>
                {likedUsers.map((user) => (
                  <LikeItem key={user.id}>
                    {user.profile_img_url ? (
                      <ProfileImage
                        src={user.profile_img_url}
                        alt={user.nickname}
                      />
                    ) : (
                      <ProfileIconContainer>
                        <DefaultProfileIcon />
                      </ProfileIconContainer>
                    )}
                    <span>{user.nickname}</span>
                  </LikeItem>
                ))}
              </ul>
            </LikesModal>
          )}
          <CommentSection
            diaryId={diary.id}
            diaryUserId={diary.user_profile.user_id}
            backgroundColor={background_color}
            setCommentCount={setCommentCount}
          />
        </DiaryComment>
      )}
    </>
  );
};

export default DiaryFooter;


const ProfileIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #ffffff;
`;

const DefaultProfileIcon = styled(FaUserCircle)`
  width: 30px;
  height: 30px;
  color: ${({ theme }) => theme.color.gray999};
`;

const SummaryFooter = styled.div<DiarySummaryProps>`
  display: ${({ isSummary }) => (isSummary ? "flex" : "none")};
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 5% 5% 5%;
`;

const DiarySpan = styled.div`
  display: flex;
  gap: 15px;

  .heart {
    display: flex;
    align-items: center;
    color: #ff5c5c;
    cursor: pointer;

    svg {
      margin: 0 4px 2px 0;
      padding-right: 2px;
    }

    :hover {
      color: #ff1d1d;
    }
  }

  .comment {
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.color.primary};

    svg {
      margin: 0 4px 2px 0;
    }

    :hover {
      color: #0055ac;
    }
  }
`;

const DiaryComment = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 100%;
  padding: 0 10%;
  margin-bottom: 100px;
`;

const LikesModal = styled.div`
  position: absolute;
  z-index: 1000;
  margin: 24px 0;
  padding: 15px 25px;
  text-align: left;
  background-color: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.grayDF};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  ul {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  li {
    padding: 7px 0;
    font-size: ${({ theme }) => theme.text.text2};
    border-bottom: 1px solid ${({ theme }) => theme.color.grayDF};
  }
`;

const LikedSpan = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding-bottom: 5px;
  border-bottom: 1px solid ${({ theme }) => theme.color.grayDF};

  .heart {
    display: flex;
    align-items: center;

    svg {
      margin-right: 4px;
    }
  }

  h4 {
    margin: 2px 2px 0 0;
    font-size: ${({ theme }) => theme.text.text2};
    font-weight: bold;
    text-align: center;
  }
`;

const LikeItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.grayDF};
`;

const ProfileImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;
