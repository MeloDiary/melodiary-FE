import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ReactComponent as AddMateIcon } from "../../assets/icons/addMate.svg";
import { ReactComponent as MateIcon } from "../../assets/icons/Mate.svg";
import { ReactComponent as RequestMateIcon } from "../../assets/icons/requestMate.svg";
import { useParams } from "react-router-dom";
import { requestMate, requestMateList } from "../../api/requestMate.api";
import { useMatesList, useDeleteMate } from "../../hooks/useMates";
import { FaAngleDown } from "react-icons/fa";
import { AiOutlineUserDelete } from "react-icons/ai";
import { IMate } from "../../models/user.model";

const AddMateButton = () => {
  const { userId: homeId } = useParams();
  const user_id = localStorage.getItem("user_id");
  const { mates } = useMatesList(Number(user_id));
  const [buttonState, setButtonState] = useState<"NM" | "RM" | "M">("NM");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {
    handleDeleteMate,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteMate(Number(user_id), () => {
    setButtonState("NM");
  });

  const onClickRequestMate = async () => {
    setLoading(true);
    setError(null);
    try {
      if (user_id && homeId) {
        await requestMate(user_id, homeId);
        setButtonState("RM");
      }
    } catch (err) {
      console.error("Error requesting mate:", err);
    } finally {
      setLoading(false);
    }
  };

  const onClickDeleteMate = async () => {
    setError(null);
    if (user_id && homeId) {
      await handleDeleteMate(Number(homeId));
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    const fetchRequsetMateList = async () => {
      setLoading(true);
      setError(null);
      try {
        if (user_id) {
          const response = await requestMateList(user_id);
          if (response.data && Array.isArray(response.data)) {
            const isRequested = response.data.some(
              (entry: { user_id: number }) => entry.user_id === Number(homeId)
            );
            if (isRequested) {
              setButtonState("RM");
            }
          }
        }
      } catch (err) {
        console.error("Error fetching request mate list:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequsetMateList();
  }, [user_id, homeId]);

  useEffect(() => {
    if (mates.some((mate: IMate) => mate.user_id === Number(homeId))) {
      setButtonState("M");
    }
  }, [mates, homeId]);

  const renderButtonContent = () => {
    switch (buttonState) {
      case "NM":
        return (
          <>
            <AddMateIcon width="20" height="20" />
            친구 신청
          </>
        );
      case "RM":
        return (
          <>
            <RequestMateIcon width="20" height="20" />
            친구 요청
          </>
        );
      case "M":
        return (
          <>
            <MateIcon width="20" height="20" />
            친구 <FaAngleDown />
          </>
        );
      default:
        return null;
    }
  };

  if (loading) return <Spinner>Loading...</Spinner>;

  return (
    <ButtonContainer>
      <BaseButton
        buttonState={buttonState}
        onClick={
          buttonState === "NM"
            ? onClickRequestMate
            : () => setIsDropdownOpen(!isDropdownOpen)
        }
        disabled={loading || deleteLoading}
      >
        {renderButtonContent()}
      </BaseButton>
      {isDropdownOpen && buttonState === "M" && (
        <DropdownMenu>
          <DropdownItem onClick={onClickDeleteMate} disabled={deleteLoading}>
            <AiOutlineUserDelete size={18} />
            친구 삭제
          </DropdownItem>
        </DropdownMenu>
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {deleteError && <ErrorMessage>{deleteError.message}</ErrorMessage>}
    </ButtonContainer>
  );
};

export default AddMateButton;

const ButtonContainer = styled.div`
  position: relative;
`;

const BaseButton = styled.button<{ buttonState: "NM" | "RM" | "M" }>`
  width: 100px;
  padding: 5px 10px;
  border-radius: 5px;
  font-family: ${({ theme }) => theme.fontFamily.kor};
  font-size: 0.78rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  background-color: ${({ buttonState, theme }) =>
    buttonState === "NM" ? theme.color.primary : theme.color.white};
  color: ${({ buttonState, theme }) =>
    buttonState === "NM" ? theme.color.white : theme.color.primary};
  border: ${({ buttonState, theme }) =>
    buttonState !== "NM" ? `1px solid ${theme.color.primary}` : "none"};

  ${({ buttonState, theme }) =>
    (buttonState === "NM" || buttonState === "M") &&
    `
    cursor: pointer;
  `}

  ${({ buttonState, theme }) =>
    buttonState === "NM" &&
    `
    &:hover {
      background-color: ${theme.color.primaryHover};
    }
  `}
`;

const DropdownMenu = styled.div`
  position: absolute;
  align-items: center;
  justify-content: center;
  top: 120%;
  z-index: 1000;
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  padding: 5px 10px;
  border: 1px solid ${({ theme }) => theme.color.primary};
  border-radius: 5px;
  background-color: ${({ theme }) => theme.color.white};
  color: ${({ theme }) => theme.color.primary};
  font-size: 0.78rem;
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.color.primaryHover};
    color: ${({ theme }) => theme.color.white};
  }

  svg {
    stroke-width: 0.01px;
  }
`;

const Spinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.color.primary};
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.color.danger};
  font-size: 0.75rem;
  margin-top: 5px;
`;
