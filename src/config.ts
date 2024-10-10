type AuthType = 'google' | 'naver' | 'kakao' | 'facebook';
type ActionType = 'signup' | 'login';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID;
const FACEBOOK_CLIENT_ID = process.env.REACT_APP_FACEBOOK_CLIENT_ID;
const KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID;

const createOAuthUrl = (type: AuthType, action: ActionType): string => {
  const client_ids = {
    google: GOOGLE_CLIENT_ID,
    naver: NAVER_CLIENT_ID,
    kakao: KAKAO_CLIENT_ID ,
    facebook: FACEBOOK_CLIENT_ID
  };

  const redirect_uri = 'https://melodiary.site/auth';
  const state = JSON.stringify({ type, action });
  
  let auth_url = '';
  if (type === 'google') {
    auth_url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_ids[type]}&redirect_uri=${redirect_uri}&response_type=code&scope=email&state=${encodeURIComponent(state)}`;
  } else if (type === 'naver') {
    auth_url =`https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${client_ids[type]}&redirect_uri=${encodeURIComponent(redirect_uri)}&state=${encodeURIComponent(state)}`;
  } else if (type === 'kakao') {
    auth_url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${client_ids[type]}&redirect_uri=${redirect_uri}&state=${encodeURIComponent(state)}&scope=account_email`;
  } else if (type === 'facebook') {
    auth_url = `https://www.facebook.com/v11.0/dialog/oauth?client_id=${client_ids[type]}&redirect_uri=${encodeURIComponent(redirect_uri)}&state=${encodeURIComponent(state)}&response_type=code`;
  }

  return auth_url;
};
export const KAKAO_SIGNUP_URL = createOAuthUrl('kakao', 'signup');
export const GOOGLE_SIGNUP_URL = createOAuthUrl('google', 'signup');
export const NAVER_SIGNUP_URL = createOAuthUrl('naver', 'signup');
export const FACEBOOK_SIGNUP_URL = createOAuthUrl('facebook', 'signup');
export const KAKAO_LOGIN_URL = createOAuthUrl('kakao', 'login');
export const GOOGLE_LOGIN_URL = createOAuthUrl('google', 'login');
export const NAVER_LOGIN_URL = createOAuthUrl('naver', 'login');
export const FACEBOOK_LOGIN_URL = createOAuthUrl('facebook', 'login');
