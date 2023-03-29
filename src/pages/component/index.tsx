/* eslint-disable @iceworks/best-practices/recommend-polyfill */
import { useEffect, useRef } from 'react';
import { CloudComponent, Button } from 'react-core-form';
import { message } from 'antd';
import axios from '@/axios';
import './index.less';

export default (props) => {
  const componentRef: any = useRef({});
  useEffect(() => {
    (window as any).removeComponent = async (id: number) => {
      await axios.get(`/component/delete/${id}`);
    };
  }, []);
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
      message.success('保存成功');
    } else {
      message.error('保存失败');
    }
    return data;
  };
  const list = async () => {
    componentRef.current.openSpin();
    const {
      data: {
        code,
        data: { data },
      },
    } = await axios('/component/list');
    componentRef.current.closeSpin();
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
  };
  useEffect(() => {
    list();
  }, []);
  return (
    <>
      <CloudComponent
        componentRef={componentRef}
        require={{
          'react-core-form': require('react-core-form'),
          'react-core-form-tools': require('react-core-form-tools'),
        }}
        onSave={addOrUpdate}
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
    </>
  );
};
