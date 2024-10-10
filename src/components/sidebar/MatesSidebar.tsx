import React from "react";
import styled from "styled-components";
import { FaUserCircle, FaLongArrowAltRight } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import {
  useAcceptMateRequest,
  useRejectMateRequest,
  useReceivedMateRequests,
  useMatesList,
} from "../../hooks/useMates";

function MatesSidebar() {
  const user_id = Number(localStorage.getItem("user_id"));
  const navigate = useNavigate();

  const { receivedRequests, loading: loadingRequests } =
    useReceivedMateRequests(user_id);

  const { mates, loading: loadingMates } = useMatesList(user_id);

  const { handleAcceptRequest } = useAcceptMateRequest(user_id);

  const { handleRejectRequest } = useRejectMateRequest(user_id);

  if (loadingRequests || loadingMates) {
    return <p>Loading...</p>;
  }

  const handleNavigate = (userId: number, nickname: string, profile_img_url: string | null) => {
    navigate(`/home/${userId}`, {
      state: { nickname, profile_img_url },
    });
  };

  return (
    <MatesSidebarWrapper>
      <Section>
        <SectionTitle>Mate Request List</SectionTitle>
        {receivedRequests.length > 0 ? (
          receivedRequests.map((request) => (
            <FriendItem key={request.user_id}>
                {request.profile_img_url ? (
                  <ProfileImage
                    src={request.profile_img_url}
                    alt={`${request.nickname} profile`}
                  />
                ) : (
                  <DefaultIcon />
                )}
              <Nickname>{request.nickname}</Nickname>
              <IconButtons>
                <AcceptIcon
                  onClick={() => handleAcceptRequest(request.request_id)}
                />
                <RejectIcon
                  onClick={() => handleRejectRequest(request.request_id)}
                />
              </IconButtons>
            </FriendItem>
          ))
        ) : (
          <p></p>
        )}
      </Section>
      <Section>
        <SectionTitle>Mates</SectionTitle>
        {mates.length > 0 ? (
          mates.map((mate) => (
            <FriendItem key={mate.user_id}>
                {mate.profile_img_url ? (
                  <ProfileImage
                    src={mate.profile_img_url}
                    alt={`${mate.nickname} profile`}
                  />
                ) : (
                  <DefaultIcon />
                )}
              <Nickname>{mate.nickname}</Nickname>
              <Arrow
                onClick={() => handleNavigate(mate.user_id, mate.nickname, mate.profile_img_url)}
              >
                <FaLongArrowAltRight />
              </Arrow>
            </FriendItem>
          ))
        ) : (
          <p></p>
        )}
      </Section>
    </MatesSidebarWrapper>
  );
}

const MatesSidebarWrapper = styled.div`
  width: 300px;
  /* height: 100vh; */
  padding: 40px;
  border-right: 1px solid ${({ theme }) => theme.color.grayDF};
`;

const Section = styled.div`
  margin-bottom: 50px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.color.greenblue};
  margin-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.color.greenblue};
  padding-bottom: 5px;
`;

const FriendItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative; 
  /* padding: 10px; */
`;

const ProfileImage = styled.img`
  width: 29px;
  height: 29px;
  border-radius: 50%;
  margin-right: 10px;
`;

const DefaultIcon = styled(FaUserCircle)`
  width: 29px;
  height: 29px;
  color: ${({ theme }) => theme.color.gray999};
  margin-right: 10px;
`;

const Nickname = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.color.black};
`;

const IconButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;
`;

const AcceptIcon = styled(FaCheck)`
  width: 18px;
  height: 18px;
  cursor: pointer;
  color: ${({ theme }) => theme.color.gray777};
  &:hover {
    color: ${({ theme }) => theme.color.grayblack};
  }
`;

const RejectIcon = styled(IoClose)`
  width: 20px;
  height: 20px;
  cursor: pointer;
  color: ${({ theme }) => theme.color.gray777};
  &:hover {
    color: ${({ theme }) => theme.color.grayblack};
  }
`;

const Arrow = styled.span`
  margin-left: auto; 
  margin-top: 4px;
  cursor: pointer;
  color: ${({ theme }) => theme.color.gray777};
  &:hover {
    color: ${({ theme }) => theme.color.grayblack};
  }
`;

export default MatesSidebar;
