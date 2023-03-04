/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-promise-reject-errors */
import { runApp } from 'ice';

const appConfig: any = {
  app: {
    rootId: 'ice-container',
    // 是否开启 ErrorBoundary，默认为 false
    errorBoundary: true,
    // 自定义错误的处理事件
    onErrorBoundaryHander: (error: Error, componentStack: string) => {
      console.log('onErrorBoundaryHander', error, componentStack);
    },
  },
  router: {
    type: 'hash',
    fallback: <div>loading...</div>,
  },
};
runApp(appConfig);
