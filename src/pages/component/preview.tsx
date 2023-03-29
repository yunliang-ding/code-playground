/* eslint-disable @iceworks/best-practices/recommend-polyfill */
import { useEffect, useState } from 'react';
import { CloudComponent } from 'react-core-form';
import { isEmpty } from 'react-core-form-tools';
import axios from '@/axios';
import './index.less';

/** 渲染逻辑 */
const RenderApp = (props) => {
  const ComponentApp: any = CloudComponent.parse({
    codes: [props],
    require: {
      'react-core-form': require('react-core-form'),
      'react-core-form-tools': require('react-core-form-tools'),
    },
  })[props.componentName];
  try {
    if (document.querySelector('.playground-iframe-app')) {
      CloudComponent.render(
        <ComponentApp {...JSON.parse(props.props)} />,
        document.querySelector('.playground-iframe-app'),
      );
    }
  } catch (error) {
    CloudComponent.render(
      <div className="playground-error-info">
        <div>解析失败:</div>
        <pre>{String(error)}</pre>
      </div>,
      document.querySelector('.playground-iframe-app'),
    );
  }
};

export default ({ searchParams }) => {
  const [data, setData] = useState({});
  // 查询模型
  const search = async () => {
    const res = await axios.get('/component/detail', {
      params: {
        id: searchParams.id,
      },
    });
    if (res.data.code === 200) {
      setData(res.data.data);
    }
  };
  useEffect(() => {
    if (searchParams.id) {
      search();
    }
  }, []);
  if (!isEmpty(data)) {
    RenderApp(data);
  }
  return (
    <div className="playground-iframe">
      <div className="playground-iframe-app" />
    </div>
  );
};
