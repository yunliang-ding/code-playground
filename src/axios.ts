import axios from 'axios';
import { getUser } from './util';

const instance = axios.create({
  baseURL: 'http://121.4.49.147:8361',
});

instance.interceptors.request.use(function (config) {
  config.data = {
    ...config.data,
    createUser: config.url === '/codeproject/list' ? undefined : getUser(),
  };
  console.log(config);
  return config;
});

export default instance;
