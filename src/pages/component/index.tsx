/* eslint-disable @iceworks/best-practices/recommend-polyfill */
import { useEffect, useRef, useState } from 'react';
import {
  CloudComponent,
  Button,
  CreateSpin,
  Icon,
  CreateDrawer,
} from 'react-core-form';
import { downloadFile } from 'react-core-form-tools';
import { notification, Space } from 'antd';
import axios from '@/axios';
import Step from '@/component/step';
import * as AntdIcons from '@ant-design/icons';
import CodeHistory from './code-history';
import './index.less';

export const sleep = (timer = 500) => new Promise((r) => setTimeout(r, timer));

export const simpleNotice = (text: string, type = 'success') => {
  notification[type]({
    message: '提示',
    description: text,
    placement: 'bottomRight',
  });
};

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
  const componentRef: any = useRef({});
  const iframeRef: any = useRef({});
  const stepRef: any = useRef({});
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
    if (code === 200) {
      simpleNotice(
        value.id
          ? `组件(${value.componentName})已更新`
          : `组件(${value.componentName})已添加`,
      );
    } else {
      simpleNotice(`组件(${value.componentName})保存失败`, 'error');
    }
    iframeRef.current?.contentWindow?.location?.reload?.();
    open();
    return data;
  };
  const list = async () => {
    stepRef.current.updateLogs('加载组件列表..');
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
    stepRef.current.updateLogs('组件列表加载完毕..');
  };
  useEffect(() => {
    list();
  }, []);
  return (
    <>
      {!loadOver && <Step stepRef={stepRef} />}
      <div style={{ display: loadOver ? 'block' : 'none' }}>
        <CloudComponent
          componentRef={componentRef}
          require={{
            'react-core-form': require('react-core-form'),
            'react-core-form-tools': require('react-core-form-tools'),
            '@ant-design/icons': AntdIcons,
          }}
          onSave={addOrUpdate}
          onLog={async (info) => {
            await stepRef.current.updateLogs(info, 1000);
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
          onAddDep={async (dep) => {
            const {
              data: { code, data },
            } = await axios.post('/dependencies/add', {
              ...dep,
              createTime: undefined,
              updateTime: undefined,
              projectId: 1,
            });
            if (code === 200) {
              simpleNotice(`新增脚本${dep.name}成功`);
              return {
                id: data,
              };
            }
            simpleNotice(`新增脚本${dep.name}失败`, 'error');
            return {};
          }}
          onUpdateDep={async (dep) => {
            const {
              data: { code },
            } = await axios.post('/dependencies/update', {
              ...dep,
              createTime: undefined,
              updateTime: undefined,
              projectId: 1,
            });
            if (code === 200) {
              simpleNotice(`更新脚本${dep.name}成功`);
              return true;
            }
            simpleNotice(`更新脚本${dep.name}失败`, 'error');
            return false;
          }}
          previewRender={(item) => {
            const url = `${location.origin}${location.pathname}#/component/preview?id=${item.id}`;
            if (item) {
              history.pushState(
                {},
                '',
                `${location.pathname}#/component?id=${item.id}`,
              );
            }
            useEffect(() => {
              open();
            }, []);
            return (
              <div className="app-preview">
                <div className="preview-address">
                  <div>{url}</div>
                  <Space>
                    <Icon
                      type="refresh"
                      hover
                      size={14}
                      color="#fff"
                      onClick={() => {
                        iframeRef.current.contentWindow.location.reload();
                        open();
                      }}
                    />
                    <Icon
                      type="run"
                      color="#fff"
                      size={14}
                      onClick={() => {
                        window.open(url);
                      }}
                      hover
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
                          props: componentRef.current.code.props,
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
            <Button
              spin
              type="primary"
              size="small"
              onClick={async () => {
                CreateDrawer({
                  title: '修改历史',
                  className: 'code-history',
                  footer: false,
                  width: 'calc(100vw - 200px)',
                  drawerProps: {
                    bodyStyle: {
                      padding: 0,
                      background: '#1e1e1e',
                    },
                  },
                }).open({
                  render() {
                    return (
                      <CodeHistory
                        tabType={componentRef.current.selectedTab}
                        componentId={componentRef.current.code.id}
                      />
                    );
                  },
                });
              }}
            >
              修改历史
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
