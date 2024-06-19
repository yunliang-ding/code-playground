import { runApp } from 'lyr';
import Loading from '@/component/loading';
import { userInfo } from './services';

runApp({
  /** 节点 */
  element: '#root',
  /** loading */
  loading: () => <Loading />,
  /** 加载勾子 */
  getInitData: async () => {
    /** 处理统一登录回跳逻辑 */
    const { pathname, search, hash } = location;
    const urlSearchParams = new URLSearchParams(search);
    const token = urlSearchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      urlSearchParams.delete('token');
      const newSearch = urlSearchParams.toString();
      history.replaceState({}, '', `${pathname}${newSearch}${hash}`); // 地址重新刷一下
    }
    const { data }: any = await userInfo();
    return {
      auth: [],
      userInfo: data,
    };
  },
});
