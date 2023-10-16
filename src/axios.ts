import { notification } from 'antd';
import { getUser } from './util';
import axios from 'axios';

const APPID = 1;

const interceptorsRequest = (requestConfig) => {
  requestConfig.headers = {
    appId: APPID.toString(),
  };
  requestConfig.data = {
    ...requestConfig.data,
    createUser: requestConfig.url === '/codeproject/list' ? 1 : getUser()?.id,
  };
  return requestConfig;
};

const interceptorsResponse = (responseConfig) => {
  const {
    data: { code, msg },
  } = responseConfig;
  if (code === 40005) {
    // 登录信息失效，之后重新登录
    location.href = `http://ulp.yunliang.cloud?redirect=${location.href}&appId=${APPID}`;
    return responseConfig;
  }
  if (code !== 200) {
    notification.error({
      message: '提示',
      description: msg || '接口异常',
    });
  }
  return responseConfig;
};

const instance = axios.create({
  baseURL: 'http://api-online.yunliang.cloud',
  withCredentials: true,
});
instance.interceptors.request.use(interceptorsRequest);
instance.interceptors.response.use(interceptorsResponse);

const instance2 = axios.create({
  baseURL: '/',
  withCredentials: true,
  headers: {
    appId: APPID.toString(),
  },
});
instance2.interceptors.request.use(interceptorsRequest);
instance2.interceptors.response.use(interceptorsResponse);

export { instance, instance2 };
