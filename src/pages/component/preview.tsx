/* eslint-disable @iceworks/best-practices/recommend-polyfill */
import { useEffect, useState } from 'react';
import { CloudComponent, babelParseCode, babelParse } from 'react-core-form';
import { isEmpty } from 'react-core-form-tools';
import axios from '@/axios';
import * as AntdIcons from '@ant-design/icons';
import { Interpreter } from 'eval5';
import './index.less';

const interpreter = new Interpreter(window);

/** 渲染逻辑 */
const RenderApp = ({ data, dependencies }) => {
  try {
    const ComponentApp: any = CloudComponent.parse({
      codes: [data],
      require: {
        'react-core-form': require('react-core-form'),
        'react-core-form-tools': require('react-core-form-tools'),
        '@ant-design/icons': AntdIcons,
        ...dependencies,
      },
    })[data.componentName];
    if (document.querySelector('.playground-iframe-app')) {
      CloudComponent.render(
        ComponentApp({...JSON.parse(data.props)}),
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
  const [dependencies, setDependencies] = useState({});
  // 查询模型
  const search = async () => {
    const res = await axios.get('/component/detail', {
      params: {
        id: searchParams.id,
      },
    });
    const depRes = await axios.post('/dependencies/list', {
      pageSize: 100,
    });
    if (depRes.data.code === 200) {
      const list = depRes.data.data.data;
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (item.content) {
          // 使用 eval5 加载脚本
          try {
            if (item.type === 'javascript') {
              await interpreter.evaluate(
                babelParseCode({
                  code: item.content,
                }),
              )();
              dependencies[item.name] = window[item.name];
            } else if (item.type === 'react') {
              dependencies[item.name] = babelParse({
                code: item.content,
              });
            } else if (item.type === 'less' && (window as any).less) {
              const { css } = await (window as any).less.render?.(item.content); // 要添加的 CSS 字符串
              const sheet = new CSSStyleSheet(); // 创建一个 CSSStyleSheet 对象
              sheet.insertRule(css, 0); // 将 CSS 规则插入到 CSS 样式表中，位置为第一个
              document.adoptedStyleSheets = [sheet];
            }
            console.log(`${item.name} 资源解析成功..`);
          } catch (error) {
            console.log(error);
            console.log(`${item.name} 资源解析失败..`);
          }
        }
      }
      setDependencies({ ...dependencies });
      setData(res.data.data);
    }
  };
  useEffect(() => {
    if (searchParams.id) {
      search();
    }
  }, []);
  if (!isEmpty(data)) {
    RenderApp({
      data,
      dependencies,
    });
  }
  return (
    <div className="playground-iframe">
      <div className="playground-iframe-app" />
    </div>
  );
};
