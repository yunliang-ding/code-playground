export const setUser = (user: string) => {
  localStorage.setItem('code-playground-user', user);
}

export const getUser = (): string => {
  return localStorage.getItem('code-playground-user') || "";
}

export const clearUser = () => {
  localStorage.removeItem('code-playground-user');
  location.reload();
}