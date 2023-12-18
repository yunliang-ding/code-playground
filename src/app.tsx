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
    // 查询 userInfo 获取详细信息
    const { data }: any = await userInfo();
    return {
      auth: [],
      userInfo: data,
    };
  },
});
