export interface ISignup {
  service_provider: string;
  authorization_code: string;
  state?: string;
}

export interface IUser {
  user_id: number;
  profile_img_url?: string;
  profile_background_img_url?: string;
  nickname: string;
  email_address?: string;
  mate_count?: number;
  diary_count?: number;
}

export interface IMate {
  user_id: number;
  nickname: string;
  profile_img_url: string | null;
}

export interface ILikedUser {
  id: number;
  nickname: string;
  profile_img_url: string;
}

export interface INicknameRequest {
    nickname: string;
}