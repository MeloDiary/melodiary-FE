import { httpClient } from "./http";

export const fetchUnreadNotifications = async (userID: number) => {
  const response = await httpClient.get(`/api/users/${userID}/notifications/unread`);
  return response.data;
};
  
export const markNotificationAsRead = async (userID: number, notificationID: number) => {
  await httpClient.put(`/api/users/${userID}/notifications/${notificationID}`);
};