import { instance2 } from "./axios";

export const setUser = (user: string) => {
  localStorage.setItem('code-playground-user', user);
}

export const getUser = (): any => {
  return JSON.parse(localStorage.getItem('code-playground-user') || "{}");
}

export const clearUser = async () => {
  await instance2.post('/unification/logout')
  localStorage.removeItem('code-playground-user');
  location.reload();
}