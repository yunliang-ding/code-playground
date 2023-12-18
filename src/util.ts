import { request } from "./axios";
import { Icon as ArcoIcon } from '@arco-design/web-react';

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
/**
 * iconUrl
 */
export const iconUrl = '//at.alicdn.com/t/c/font_3520199_pheco7nb3xf.js';

/**
 * icon
 */
export const Icon = ArcoIcon.addFromIconFontCn({
  src: iconUrl,
});