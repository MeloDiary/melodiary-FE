export interface IMusic {
  music_url: string;
  title: string;
  artist: string;
}

export interface IWeather {
  location: string;
  icon: string;
  avg_temperature: number;
}

export interface IDiary {
  id: number;
  user_profile: {
    user_id: number;
    profile_img_url: string;
    nickname: string;
  };
  like_count: number | null;
  created_at: string | null;
  body: {
    title: string;
    content: string;
    img_urls: string[] | null;
    mood: string | null;
    emoji: string | null;
    privacy: "public" | "mate" | "private";
    music: IMusic | null;
    weather: IWeather | null;
    background_color: string | null;
  };
  liked: boolean;
}
