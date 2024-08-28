export interface IUserProfile {
  id: number;
  profile_img_url: string | null;
  profile_background_img_url: string | null;
  nickname: string;
  email_address: string;
  mate_count: number;
  diary_count: number;
}

export interface IMoodData {
  date: string;
  diary_id: number;
  mood: string;
}

interface IMoodUserProfile {
  user_id: number;
  profile_img_url: string | null;
  nickname: string;
}

export interface IMood {
  user_profile: IMoodUserProfile;
  moods: IMoodData[];
}