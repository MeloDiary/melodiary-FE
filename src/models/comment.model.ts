export interface IComment {
  comment_id: number;
  content: string;
  created_at: string;
  writer_user_profile: {
    user_id: number;
    nickname: string;
    profile_img_url: string;
  };
  diary_id: number; 
  mentioned_user_profile?: {
    user_id: number;
    nickname: string;
  } | null; 
}
