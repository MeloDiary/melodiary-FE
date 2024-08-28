import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { INotification } from "../../models/notification.model";
import { useSearchUser } from "../../hooks/useSearchResult";

interface NotificationDropdownProps {
  notifications: INotification[];
  loading: boolean;
  markAsRead: (notificationID: number) => void;
}

const NotificationDropdown = React.forwardRef<
  HTMLDivElement,
  NotificationDropdownProps
>(({ notifications, loading, markAsRead }, ref) => {
  const navigate = useNavigate();
  const { handleSearch } = useSearchUser();

  const handleNotificationClick = async (notification: INotification) => {
    markAsRead(notification.notification_id);

    switch (notification.category) {
      case "diary":
        navigate(`/diary/${notification.diary_id}`);
        break;
      case "mate": {
        navigate(`/mates`);
        break;
      }
      default:
        console.warn("Unknown notification category:", notification.category);
        break;
    }
  };

  if (loading) {
    return <Dropdown ref={ref}>Loading...</Dropdown>;
  }

  if (notifications.length === 0) {
    return <Dropdown ref={ref}>No notifications</Dropdown>;
  }

  return (
    <Dropdown ref={ref}>
      <NotificationHeader>업데이트</NotificationHeader>
      <NotificationBody>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.notification_id}
            onClick={() => handleNotificationClick(notification)}
          >
            <NotificationContent>{notification.content}</NotificationContent>
            <Time>{notification.date.slice(0, 10)}</Time>
          </NotificationItem>
        ))}
      </NotificationBody>
    </Dropdown>
  );
});

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  width: 320px;
  max-height: 400px;
  overflow-y: auto;
  background: ${({ theme }) => theme.color.white};
  font-family: ${({ theme }) => theme.fontFamily.kor};
  color: ${({ theme }) => theme.color.black};
  border: 1px solid ${({ theme }) => theme.color.grayDF};
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const NotificationHeader = styled.div`
  padding: 12px 16px;
  font-weight: bold;
  border-bottom: 1px solid ${({ theme }) => theme.color.grayDF};
`;

const NotificationBody = styled.div`
  display: flex;
  flex-direction: column;
`;

const NotificationItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  text-align: left;
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.color.grayDF};
  cursor: pointer;
  &:last-child {
    border-bottom: none;
  }
`;

const NotificationContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  p {
    margin: 0;
    text-align: left;
  }
`;

const Time = styled.span`
  margin-left: 10px;
  color: ${({ theme }) => theme.color.gray999};
  font-size: 12px;
  white-space: nowrap;
`;

export default NotificationDropdown;
