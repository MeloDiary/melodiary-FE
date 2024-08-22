import { useEffect, useState } from "react";
import { fetchAllDiaries, fetchUserProfile } from "../api/mypage.api";
import { IDiary } from "../models/diary.model";
import { IUserProfile } from "../models/mypage.model";

export const useMyPage = () => {
  const [userProfile, setUserProfile] = useState<IUserProfile>();
  const [userDiaries, setUserDiaries] = useState<IDiary[]>([]);

  const storedUserId = localStorage.getItem('user_id');
  const userId = storedUserId ? Number(storedUserId) : null;

  const fetchUserProfileData = async (userId: number) => {
    try {
      const userProfileData = await fetchUserProfile(userId);
      setUserProfile(userProfileData);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAllDiariesData = async () => {
    try {
      const userDiaryData = await fetchAllDiaries();
      setUserDiaries(userDiaryData);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchAllDiariesData();
    fetchUserProfileData(userId!);
  }, []);

  return { userProfile, userDiaries };
};
