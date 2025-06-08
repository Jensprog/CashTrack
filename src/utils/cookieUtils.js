/**
 * @file Cookie helper function for LoginForm, AuthContext and axiosConfig.
 */

export const setCookie = (name, value, maxAge = 604800) => {
  const isSecureEnvironment = process.env.NODE_ENV === 'production';
  const path = process.env.NODE_ENV === 'production' ? '/cashtrack' : '/';

  document.cookie = `${name}=${value}; path=${path}; SameSite=Strict${isSecureEnvironment ? '; Secure' : ''}; max-age=${maxAge}`;
};

export const removeCookie = (name) => {
  const path = process.env.NODE_ENV === 'production' ? '/cashtrack' : '/';
  document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const getCookie = (name) => {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
};
