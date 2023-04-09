/* eslint-disable @iceworks/best-practices/recommend-polyfill */
import { useEffect, useRef, useState } from 'react';
import { CloudComponent, Button } from 'react-core-form';
import { notification } from 'antd';
import axios from '@/axios';
import Step from '@/component/step';
import './index.less';

const sleep = (timer = 500) => new Promise((r) => setTimeout(r, timer));

export default (props) => {
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
    if (code === 200) {
      notification.success({
        message: '提示',
        description: value.id ? '已更新' : '添加成功',
      });
    } else {
      notification.error({
        message: '提示',
        description: '保存失败',
      });
    }
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
              open: String(item.id) === props.searchParams.id,
              selected: String(item.id) === props.searchParams.id,
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
          initialDependencies={[
            {
              name: 'html2canvas',
              version: '1.4.1',
              path: 'https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.js',
            },
            {
              name: 'axios',
              version: '1.3.5',
              path: 'https://unpkg.com/axios@1.3.5/dist/axios.min.js',
            },
            {
              name: 'dayjs',
              version: '1.11.7',
              path: 'https://unpkg.com/dayjs@1.11.7/dayjs.min.js',
            },
          ]}
          onAdd={async (value) => {
            await new Promise((res) => setTimeout(res, 500));
            return await addOrUpdate(value);
          }}
          onChange={() => {
            if (componentRef.current.code) {
              history.pushState(
                {},
                '',
                `${location.pathname}#/component?id=${componentRef.current.code.id}`,
              );
            }
          }}
          extra={[
            <Button
              type="primary"
              size="small"
              key="new-window-preview"
              className="new-window-preview"
              onClick={() => {
                window.open(
                  `${location.pathname}#/component/preview?id=${componentRef.current.code.id}`,
                );
              }}
            >
              新窗口预览
            </Button>,
          ]}
        />
      </div>
    </>
  );
};
