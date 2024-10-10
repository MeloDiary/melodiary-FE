import { useEffect, useState } from "react";
import { fetchAllDiaries, fetchUserProfile, fetchCheckNickname, fetchChangeNickname, fetchDeleteAccount, fetchMoodGraph } from "../api/mypage.api";
import { IDiary } from "../models/diary.model";
import { IUserProfile, IMoodData, IMood } from "../models/mypage.model";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const useMyPage = () => {
  const [userProfile, setUserProfile] = useState<IUserProfile>();
  const [userDiaries, setUserDiaries] = useState<IDiary[]>([]);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean | null>(null);
  const [hasCheckedNickname, setHasCheckedNickname] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState<boolean | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [mood, setMood] = useState<IMood | null>(null);
  const [page, setPage] = useState<number>(1);
  const [more, setMore] = useState(true);
  const limit = 9;

  const navigate = useNavigate();
  const storedUserId = localStorage.getItem('user_id');
  const userId = storedUserId ? Number(storedUserId) : null;

  // 사용자 정보 조회
  const fetchUserProfileData = async (userId: number) => {
    try {
      const userProfileData = await fetchUserProfile(userId);
      setUserProfile(userProfileData);
    } catch (err: any) {
      console.log(err);
      setError(new Error("Failed to fetch user profile: " + err.message));
    }
  };

  // 사용자가 작성한 전체 일기 조회
  const fetchAllDiariesData = async () => {
    try {
      const userDiaryData = await fetchAllDiaries(page, limit);
      if (userDiaryData.length > 0) {
        // 이전 데이터에 새로 불러온 데이터 추가
        setUserDiaries((prevDiaries) => {
          // 첫 페이지가 아닌 경우에만 데이터 추가
          if (page === 1) {
            return userDiaryData;
          } else {
            return [...prevDiaries, ...userDiaryData];
          }
        });
      } else {
        setMore(false); // 더 이상 가져올 데이터가 없는 경우
      }
    } catch (err: any) {
      console.log(err);
      setError(new Error("Failed to fetch user diaries: " + err.message));
    }
  };

  // 닉네임 중복 확인
  const fetchCheckNicknameAvailability = async (nickname: string) => {
    try {
      await fetchCheckNickname(nickname);
      setIsNicknameAvailable(true);  // 200 응답의 경우 사용 가능
    } catch (err: any) {
      if (err.response?.status === 409) {
        setIsNicknameAvailable(false); // 409 응답의 경우 사용 불가
      } else {
        console.log(err);
        setIsNicknameAvailable(null);
      }
    }
  };

  // 닉네임 변경
  const fetchChangeNicknameData = async (userId: number, nickname: string) => {
    if (userId === null) return;

    try {
      await fetchChangeNickname(userId, nickname);
    } catch (err) {
      console.log(err);
    }
  };

  // 회원 탈퇴
  const fetchDeleteUserAccount = async (userId: number) => {
    try {
      setIsDeleting(true);
      await fetchDeleteAccount(userId);
      setDeleteSuccess(true);
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_id');
      navigate("/");
    } catch (err) {
      setDeleteSuccess(false);
      console.log(err);
    } finally {
      setIsDeleting(false);
    }
  };

  // 기분 그래프
  const fetchMoodGraphData = async (year: number, month: number) => {
    try {
      const moodGraphData: IMood = await fetchMoodGraph(`${year}-${String(month).padStart(2, '0')}`);
  
      // 날짜별로 moods 정리
      const groupedMoods: { [key: string]: IMoodData[] } = {};
  
      moodGraphData.moods.forEach((mood: IMoodData) => {
        // 시간대를 KST로 명시적으로 해석
        const dateKey = dayjs.tz(mood.date, 'Asia/Seoul').format('YYYY-MM-DD');
        if (!groupedMoods[dateKey]) {
          groupedMoods[dateKey] = [];
        }
        groupedMoods[dateKey].push(mood);
      });
  
      setMood(moodGraphData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (userId !== null) {
      fetchUserProfileData(userId);
      fetchAllDiariesData(); // 첫 페이지 로드
    }
  }, [userId]);

  return {
    userProfile,
    userDiaries,
    isNicknameAvailable,
    hasCheckedNickname,
    mood,
    fetchAllDiariesData,
    setHasCheckedNickname,
    fetchCheckNicknameAvailability,
    fetchChangeNicknameData,
    fetchDeleteUserAccount,
    fetchMoodGraphData,
    isDeleting,
    deleteSuccess,
    error,
    setPage,
    more,
    page,
  };
};
