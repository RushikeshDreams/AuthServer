import { postMethodCall } from './api-handler';

export const signupApi = async (data) => {
  return await postMethodCall(`${import.meta.env.VITE_API_URL}/signup`, data);
};

export const signinApi = async (data) => {
  return await postMethodCall(`${import.meta.env.VITE_API_URL}/signin`, data);
};
