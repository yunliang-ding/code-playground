import { request } from "./axios";

export const setUser = (user: string) => {
  localStorage.setItem('code-playground-user', user);
}

export const getUser = (): any => {
  return JSON.parse(localStorage.getItem('code-playground-user') || "{}");
}

export const clearUser = async () => {
  await request.post('/user/logout')
  localStorage.removeItem('code-playground-user');
  location.reload();
}
