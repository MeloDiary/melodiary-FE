import { IUser } from '../models/user.model';
import { httpClient } from './http';

export const fetchUserInfo = async (userId: number): Promise<IUser> => {
  const response = await httpClient.get<IUser>(`/api/users/${userId}`);
  return response.data;
};
