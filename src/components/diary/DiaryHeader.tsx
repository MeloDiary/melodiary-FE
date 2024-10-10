import React, { useState } from "react";
import styled from "styled-components";
import { BiChevronsLeft, BiChevronsRight } from "react-icons/bi";
import { FaGlobe, FaLock, FaUserCircle, FaUserFriends } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { DiaryItemProps, DiarySummaryProps } from "./DiaryItem";
import CustomAlert from "../customAlert/CustomAlert";
import { useDeleteDiary } from "../../hooks/useDiary";

const DiaryHeader: React.FC<DiaryItemProps> = ({
  diary,
  user,
  isSummary = false,
  toggleExpand,
  isExpanded,
}) => {
  const navigate = useNavigate();
  const { deleteDiary, loading, error } = useDeleteDiary();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isDeleteSuccessAlertVisible, setIsDeleteSuccessAlertVisible] =
    useState(false);

  const userIdFromStorage = localStorage.getItem("user_id"); // localStorage에서 user_id 가져오기
  const isOwner =
    userIdFromStorage && Number(userIdFromStorage) === user.user_id;

  const handleEdit = () => {
    navigate(`/writeDiary`, { state: { diary } });
  };

  const handleDelete = async () => {
    setIsAlertVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDiary(diary.id);
      setIsDeleteSuccessAlertVisible(true);
    } catch (err) {
      console.error("삭제 오류:", err);
    } finally {
      setIsAlertVisible(false);
    }
  };

  const cancelDelete = () => {
    setIsAlertVisible(false);
  };

  const handleCloseSuccessAlert = () => {
    setIsDeleteSuccessAlertVisible(false);
    navigate(0);
  };

  const renderPrivacyIcon = () => {
    switch (diary.body.privacy) {
      case "mate":
        return <FaUserFriends />;
      case "public":
        return <FaGlobe />;
      case "private":
        return <FaLock />;
      default:
        return null;
    }
  };

  return (
    <>
      <HeaderContainer isSummary={isSummary}>
        <Title>
          {isSummary ? (
            <DiaryProfile isSummary={isSummary}>
              <Link to={`/home/${user.user_id}`}>
                {user.profile_img_url ? (
                  <ProfileImage
                    isSummary={isSummary}
                    src={user.profile_img_url}
                    alt={user.nickname}
                  />
                ) : (
                  <ProfileIconContainer isSummary={isSummary}>
                    <DefaultProfileIcon isSummary={isSummary} />
                  </ProfileIconContainer>
                )}
              </Link>
              <ProfileText>
                <p>{user.nickname}</p>
                <DiaryDate isSummary={isSummary}>
                  {diary.created_at?.slice(0, 10)}
                </DiaryDate>
              </ProfileText>
            </DiaryProfile>
          ) : (
            <>
              <PrivacyContainer>
                {renderPrivacyIcon()}{" "}
                <PrivacyText>
                  {diary.body.privacy === "mate"
                    ? "친구공개"
                    : diary.body.privacy === "public"
                    ? "전체공개"
                    : "나만보기"}
                </PrivacyText>
              </PrivacyContainer>
              <DiaryDate isSummary={isSummary}>
                {diary.created_at?.slice(0, 10)}
              </DiaryDate>
            </>
          )}

          {!isSummary && (
            <Right>
              <DiaryTitle isSummary={isSummary}>{diary.body.title}</DiaryTitle>
            </Right>
          )}
        </Title>
        {!isSummary && (
          <Right>
            {isOwner && (
              <DiaryButton>
                <button type="button" onClick={handleEdit}>
                  수정하기
                </button>
                <button type="button" onClick={handleDelete} disabled={loading}>
                  삭제하기
                </button>
              </DiaryButton>
            )}
            <DiaryProfile isSummary={isSummary}>
              <Link to={`/home/${user.user_id}`}>
                {user.profile_img_url ? (
                  <ProfileImage
                    isSummary={isSummary}
                    src={user.profile_img_url}
                    alt={user.nickname}
                  />
                ) : (
                  <ProfileIconContainer isSummary={isSummary}>
                    <DefaultProfileIcon isSummary={isSummary} />
                  </ProfileIconContainer>
                )}
              </Link>
              <p>{user.nickname}</p>
            </DiaryProfile>
          </Right>
        )}
        {!isSummary && toggleExpand && (
          <ToggleButton onClick={toggleExpand}>
            {isExpanded ? <BiChevronsRight /> : <BiChevronsLeft />}
          </ToggleButton>
        )}
      </HeaderContainer>
      {isAlertVisible && (
        <CustomAlert
          message="일기를 삭제하시겠습니까?"
          subMessage="삭제된 일기는 복구할 수 없습니다."
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          showCancelButton={true}
        />
      )}
      {isDeleteSuccessAlertVisible && (
        <CustomAlert
          message="일기가 삭제되었습니다."
          subMessage="새로운 일기를 작성 해보세요!"
          onConfirm={handleCloseSuccessAlert}
          showCancelButton={false}
        />
      )}
    </>
  );
};

export default DiaryHeader;

const ProfileIconContainer = styled.div<DiarySummaryProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ isSummary }) => (isSummary ? "51px" : "29px")};
  height: ${({ isSummary }) => (isSummary ? "51px" : "29px")};
  border-radius: 50%;
  background-color: #ffffff;
`;

const DefaultProfileIcon = styled(FaUserCircle)<DiarySummaryProps>`
  width: ${({ isSummary }) => (isSummary ? "55px" : "28px")};
  height: ${({ isSummary }) => (isSummary ? "55px" : "28px")};
  color: ${({ theme }) => theme.color.gray999};
`;

const HeaderContainer = styled.div<DiarySummaryProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  max-width: 100%;
  padding: ${({ isSummary }) => (isSummary ? "5% 0 0 5%" : "80px 10% 0 10%")};
  margin-bottom: 20px;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
`;

const PrivacyContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
  font-size: ${({ theme }) => theme.text.text3};
  color: ${({ theme }) => theme.color.gray999};
`;

const PrivacyText = styled.p`
  margin: 0;
`;

const DiaryTitle = styled.h2<DiarySummaryProps>`
  display: flex;
  justify-content: start;
  margin: 0;
  margin: ${({ isSummary }) => (isSummary ? "0 0 15px 0" : "10px 0")};
  font-size: ${({ theme }) => theme.title.title3};
  font-weight: 600;
  color: ${({ theme }) => theme.color.black};
`;

const DiaryDate = styled.div<DiarySummaryProps>`
  font-size: ${({ isSummary, theme }) =>
    isSummary ? ` ${theme.text.text2}` : `${theme.text.text1}`};
  color: ${({ isSummary, theme }) =>
    isSummary ? ` ${theme.color.gray999}` : `${theme.color.black}`};
  margin: ${({ isSummary }) => (isSummary ? "0" : "0 0 10px 0")};
`;

const Right = styled.div`
  display: flex;
  align-items: start;
  justify-content: start;
  gap: 5px;
`;

const DiaryButton = styled.div`
  button {
    padding: 5px 10px;
    border: none;
    border-right: 1px solid ${({ theme }) => theme.color.grayDF};
    background-color: transparent;
    cursor: pointer;
    color: ${({ theme }) => theme.color.gray777};
  }
`;

const DiaryProfile = styled.div<DiarySummaryProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ isSummary }) => (isSummary ? "10px" : "5px")};

  p {
    padding-bottom: ${({ isSummary }) => (isSummary ? "0" : "2px")};
    font-weight: ${({ isSummary }) => (isSummary ? "600" : "0")};
  }
`;

const ProfileText = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProfileImage = styled.img<DiarySummaryProps>`
  width: ${({ isSummary }) => (isSummary ? "55px" : "28px")};
  height: ${({ isSummary }) => (isSummary ? "55px" : "28px")};
  border-radius: 50%;
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 30px;
  left: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${({ theme }) => theme.color.gray777};
`;
