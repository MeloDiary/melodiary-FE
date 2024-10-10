import { useState, useEffect } from "react";
import { INotification } from "../models/notification.model";
import { fetchUnreadNotifications, markNotificationAsRead } from "../api/notification.api";

export const useNotifications = (userID: number) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNotifications = async () => {
    try {
      const data = await fetchUnreadNotifications(userID);
      const sortedData = data.sort((a: INotification, b: INotification) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      setNotifications(sortedData);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchNotifications();
  }, [userID]);

  const markAsRead = async (notificationID: number) => {
    try {
      await markNotificationAsRead(userID, notificationID);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.notification_id !== notificationID)
      );
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  return { notifications, loading, fetchNotifications, markAsRead };
};
