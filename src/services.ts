import { request } from '@/axios';

export const userInfo = (): Promise<any> => {
  return request.post('/user/info');
};
