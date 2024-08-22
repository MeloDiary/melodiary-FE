export interface IUserProfile {
  id: number;
  profile_img_url: string | null;
  profile_background_img_url: string | null;
  nickname: string;
  email_address: string;
  mate_count: number;
  diary_count: number;
}