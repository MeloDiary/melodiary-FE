type AuthType = 'google' | 'naver' | 'kakao';
type ActionType = 'signup' | 'login';

const createOAuthUrl = (type: AuthType, action: ActionType): string => {
  const client_ids = {
    google: '137081432785-0rhjqb5shd67ov2ec4escraufk5fd6kt.apps.googleusercontent.com',
    naver: 'YOUR_NAVER_CLIENT_ID',
    kakao: 'YOUR_KAKAO_CLIENT_ID'
  };

  const redirect_uri = 'localhost';
  // const redirect_uri = 'https://melo-diary.vercel.app/auth';
  //const redirect_uri = `https://melo-diary.vercel.app/auth?type=google`;
  const state = JSON.stringify({ type, action });
  
  let auth_url = '';
  if (type === 'google') {
    auth_url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_ids[type]}&redirect_uri=${redirect_uri}&response_type=code&scope=email&state=${encodeURIComponent(state)}`;
  } else if (type === 'naver') {
    auth_url = `https://nid.naver.com/oauth2.0/authorize?client_id=${client_ids[type]}&redirect_uri=${redirect_uri}&response_type=code&state=${encodeURIComponent(state)}`;
  } else if (type === 'kakao') {
    auth_url = `https://kauth.kakao.com/oauth/authorize?client_id=${client_ids[type]}&redirect_uri=${redirect_uri}&response_type=code&state=${encodeURIComponent(state)}`;
  }

  return auth_url;
};
export const KAKAO_SIGNUP_URL = createOAuthUrl('kakao', 'signup');
export const GOOGLE_SIGNUP_URL = createOAuthUrl('google', 'signup');
export const NAVER_SIGNUP_URL = createOAuthUrl('naver', 'signup');
export const KAKAO_LOGIN_URL = createOAuthUrl('kakao', 'login');
export const GOOGLE_LOGIN_URL = createOAuthUrl('google', 'login');
//네이버 state 추후 수정 Math.random().toString(36).substr(2, 11)
export const NAVER_LOGIN_URL = createOAuthUrl('naver', 'login');

export const GOOGLE_REDIRECT_URI = `https://melo-diary.vercel.app/auth?type=google`;
export const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=email`;
