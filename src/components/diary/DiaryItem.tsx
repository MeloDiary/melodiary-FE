import React, { MouseEvent } from "react";
import styled from "styled-components";
import DiaryHeader from "./DiaryHeader";
import DiaryContent from "./DiaryContent";
import DiaryFooter from "./DiaryFooter";
import { IDiary } from "../../models/diary.model";
import { useLocation, useNavigate } from "react-router-dom";
import { ILikedUser, IUser } from "../../models/user.model";

export interface DiaryItemProps {
  diary: IDiary;
  user: IUser;
  likedUsers?: ILikedUser[];
  isSummary?: boolean;
  isExpanded?: boolean;
  toggleExpand?: () => void;
}

const DiaryItem: React.FC<DiaryItemProps> = ({
  diary,
  user,
  likedUsers = [],
  isSummary = false,
  isExpanded = false,
  toggleExpand,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isMatesPage = location.pathname.includes("mates");

  const background_color = diary.body.background_color || "default";

  const handleDiaryClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    
    if (target.closest('.slick-dots') || target.closest('.slick-arrow')) {
      e.stopPropagation(); 
      return;
    }

    if (isSummary) {
      navigate(`/diary/${diary.id}`);
    }
  };

  return (
    <DiaryWrapper
      background_color={background_color}
      isExpanded={isExpanded}
      isSummary={isSummary}
      isMatesPage={isMatesPage}
    >
      <DiaryContainer
        background_color={background_color}
        isExpanded={isExpanded}
        isSummary={isSummary}
        isMatesPage={isMatesPage}
        onClick={handleDiaryClick}
      >
        <Diary isSummary={isSummary}>
          <DiaryHeader
            diary={diary}
            user={user}
            likedUsers={likedUsers}
            isSummary={isSummary}
            toggleExpand={toggleExpand}
            isExpanded={isExpanded}
          />
          <DiaryContent
            diary={diary}
            isSummary={isSummary}
            isExpanded={isExpanded}
          />
          <DiaryFooter
            diary={diary}
            user={user}
            likedUsers={likedUsers}
            isSummary={isSummary}
            isExpanded={isExpanded}
            background_color={background_color}
          />
        </Diary>
      </DiaryContainer>
    </DiaryWrapper>
  );
};

export default DiaryItem;

export interface DiaryAllProps {
  background_color: string;
  isExpanded: boolean;
  isSummary: boolean;
  isMatesPage: boolean;
}

export interface DiarySummaryProps {
  isSummary: boolean;
}

const DiaryWrapper = styled.div<DiaryAllProps>`
  justify-content: center;
  align-items: center;
`;

const DiaryContainer = styled.div<DiaryAllProps>`
  position: relative;
  top: 0;
  height: ${({ isExpanded, isSummary }) =>
    isExpanded ? "100%" : isSummary ? "auto" : "auto"};
  overflow-y: ${({ isExpanded, isSummary }) =>
    isExpanded ? "auto" : isSummary ? "visible" : "hidden"};
  overflow-x: hidden;
  background-color: ${({ theme, background_color }) =>
    theme.diaryColor[background_color]?.background ||
    theme.diaryColor.default.background};
  margin-bottom: ${({ isExpanded, isSummary }) =>
    isExpanded ? "0" : isSummary ? "50px" : "0"};
  border-radius: ${({ isSummary }) => (isSummary ? "20px" : "0")};
  border: ${({ isSummary, theme }) =>
    isSummary ? `1px solid ${theme.color.grayDF}` : "none"};
  max-width: ${({ isExpanded, isSummary }) =>isExpanded ? "100vw" : isSummary ? "50vw" : "50vw"};
  width: ${({ isExpanded, isSummary }) =>
    isExpanded ? "" : isSummary ? "50vw" : ""};
`;

const Diary = styled.div<DiarySummaryProps>`
  cursor: ${({ isSummary }) => (isSummary ? "pointer" : "default")};
`;
