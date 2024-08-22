// logoutUtility.ts
export const logoutUtility = () => {
    // 로그아웃 처리
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');

    window.location.href = '/login';
  };
  