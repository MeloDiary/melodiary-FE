import { ILikedUser, IMate, IUser } from "./models/user.model";

export const dummyUsers: IUser[] = [
  {
    user_id: 1,
    profile_img_url:
      "https://i.pinimg.com/236x/af/2b/53/af2b53799b1f93d7e508d60fd7d7b6a1.jpg",
    profile_background_img_url: "",
    nickname: "김머쓱",
    email_address: "musseuk@example.com",
    mate_count: 15,
    diary_count: 27,
  },
  {
    user_id: 2,
    profile_img_url: "",
    profile_background_img_url: "",
    nickname: "Kim",
    email_address: "Kim@example.com",
    mate_count: 15,
    diary_count: 27,
  },
  {
    user_id: 3,
    profile_img_url: "",
    profile_background_img_url: "",
    nickname: "Lee",
    email_address: "Lee@example.com",
    mate_count: 15,
    diary_count: 27,
  },
  {
    user_id: 4,
    profile_img_url: "",
    profile_background_img_url: "",
    nickname: "따봉고양이",
    email_address: "Lee@example.com",
    mate_count: 15,
    diary_count: 27,
  },
  {
    user_id: 5,
    profile_img_url: "",
    profile_background_img_url: "",
    nickname: "구름강쥐",
    email_address: "Lee@example.com",
    mate_count: 15,
    diary_count: 27,
  },
  {
    user_id: 6,
    profile_img_url: "",
    profile_background_img_url: "",
    nickname: "심슨냥이",
    email_address: "Lee@example.com",
    mate_count: 15,
    diary_count: 27,
  },
  {
    user_id: 7,
    profile_img_url: "",
    profile_background_img_url: "",
    nickname: "식빵목걸이",
    email_address: "Lee@example.com",
    mate_count: 15,
    diary_count: 27,
  },
];
  
export const dummyLikedUsers: ILikedUser[] = [
  { id: 1, nickname: "user1", profile_img_url: "" },
  { id: 2, nickname: "user2", profile_img_url: "" },
  { id: 3, nickname: "user3", profile_img_url: "" },
];

export const dummyDiaryData = {
  diaryID: 2764,
  likeCount: 10,
  userHasLiked: false,
};