/* eslint-disable @iceworks/best-practices/recommend-polyfill */
import { useEffect, useRef, useState } from 'react';
import { CloudComponent, Button, CreateSpin } from 'react-core-form';
import { downloadFile } from 'react-core-form-tools';
import { notification, Space } from 'antd';
import axios from '@/axios';
import Step from '@/component/step';
import './index.less';

const sleep = (timer = 500) => new Promise((r) => setTimeout(r, timer));

const { open, close } = CreateSpin({
  getContainer: () => {
    return document.querySelector('.app-preview');
  },
  style: {
    top: 30,
  },
  mode: 'vscode',
} as any);

const Component = ({ initialDependencies = [], id }) => {
  const iframeRef: any = useRef();
  const [logs, setLogs]: any = useState(['资源加载中..']);
  const updateLog = async (log, timer = 500) => {
    await sleep(timer);
    logs.push(log);
    setLogs([...logs]);
  };
  const componentRef: any = useRef({});
  const [loadOver, setLoadOver]: any = useState(false);
  const addOrUpdate = async (value) => {
    const {
      data: { code, data },
    } = await axios.post(value.id ? '/component/update' : '/component/add', {
      ...value,
      props: JSON.stringify(value.props),
      createTime: undefined,
      updateTime: undefined,
      open: undefined,
      selected: undefined,
    });
    if (code !== 200) {
      notification.error({
        message: '提示',
        description: '保存失败',
        placement: 'bottomRight',
      });
    }
    iframeRef.current.contentWindow.location.reload();
    open();
    return data;
  };
  const list = async () => {
    updateLog('加载组件列表..');
    const {
      data: {
        code,
        data: { data },
      },
    } = await axios('/component/list');
    componentRef.current.setComponent(
      code === 200
        ? data.map((item) => {
            return {
              ...item,
              open: String(item.id) === id,
              selected: String(item.id) === id,
              props: JSON.parse(item.props),
            };
          })
        : [],
    );
    await sleep();
    updateLog('组件列表加载完毕..');
  };
  useEffect(() => {
    list();
  }, []);
  return (
    <>
      {!loadOver && <Step logs={logs} />}
      <div style={{ display: loadOver ? 'block' : 'none' }}>
        <CloudComponent
          componentRef={componentRef}
          require={{
            'react-core-form': require('react-core-form'),
            'react-core-form-tools': require('react-core-form-tools'),
          }}
          onSave={addOrUpdate}
          onLog={async (info) => {
            await updateLog(info, 1000);
            if (info === '加载完毕') {
              await sleep(1000);
              setLoadOver(true);
            }
          }}
          initialDependencies={initialDependencies}
          onAdd={async (value) => {
            await new Promise((res) => setTimeout(res, 500));
            return await addOrUpdate(value);
          }}
          onChange={() => {
            if (componentRef.current.code) {
              open();
              history.pushState(
                {},
                '',
                `${location.pathname}#/component?id=${componentRef.current.code.id}`,
              );
            }
          }}
          onAddDep={async (dep) => {
            const {
              data: { code, data },
            } = await axios.post('/dependencies/add', {
              ...dep,
              projectId: 1,
            });
            return code === 200
              ? {
                  id: data,
                }
              : {};
          }}
          previewRender={(item) => {
            const url = `${location.origin}${location.pathname}#/component/preview?id=${item.id}`;
            return (
              <div className="app-preview">
                <div className="preview-address">
                  <div>{url}</div>
                  <Space>
                    <i
                      className="iconfont spicon-shuaxin"
                      onClick={() => {
                        iframeRef.current.contentWindow.location.reload();
                        open();
                      }}
                    />
                    <i
                      className="iconfont spicon-zhihang"
                      onClick={() => {
                        window.open(url);
                      }}
                    />
                  </Space>
                </div>
                <iframe
                  ref={iframeRef}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  src={url}
                  onLoad={async () => {
                    await sleep();
                    close();
                  }}
                />
              </div>
            );
          }}
          extra={[
            <Button
              spin
              type="primary"
              size="small"
              onClick={async () => {
                const url = URL.createObjectURL(
                  new Blob(
                    JSON.stringify(
                      [
                        {
                          componentName:
                            componentRef.current.code.componentName,
                          react: componentRef.current.code.react,
                          less: componentRef.current.code.less,
                          meta: componentRef.current.code.props,
                        },
                      ],
                      null,
                      2,
                    ).split(''),
                  ),
                );
                await downloadFile(
                  url,
                  `${componentRef.current.code.componentName}.json`,
                );
              }}
            >
              导出当前组件
            </Button>,
          ]}
        />
      </div>
    </>
  );
};

const bodySpin = CreateSpin({
  getContainer: () => {
    return document.querySelector('body');
  },
  style: {
    top: 0,
  },
  mode: 'vscode',
} as any);

export default (props) => {
  const [spin, setSpin] = useState(true);
  const [dependencies, setDependencies] = useState([]);
  useEffect(() => {
    bodySpin.open();
    axios
      .post('/dependencies/list', {
        pageSize: 100,
      })
      .then(
        ({
          data: {
            data: { data },
          },
        }) => {
          bodySpin.close();
          setDependencies(data);
          setSpin(false);
        },
      );
  }, []);
  return spin ? null : (
    <Component initialDependencies={dependencies} id={props.searchParams.id} />
  );
};
