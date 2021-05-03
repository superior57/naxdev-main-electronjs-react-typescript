import { constants } from '@/constants';

export const setToken = (token: string) => {
  localStorage.setItem(constants.TOKEN_KEY, token);
  return token;
};

export const getToken = () => {
  return localStorage.getItem(constants.TOKEN_KEY);
};

export const clearToken = () => {
  localStorage.setItem(constants.TOKEN_KEY, '');
};
