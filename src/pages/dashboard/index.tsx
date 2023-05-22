import { CreateModal, Icon } from 'react-core-form';
import axios from '@/axios';
import './index.less';
import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import Component from '../component';

export default ({ searchParams }) => {
  const [list, setList] = useState([]);
  const [spin, setSpin] = useState(true);
  const addOrUpdate = async (
    initialValues = {
      id: undefined,
    } as any,
  ) => {
    CreateModal({
      title: initialValues.id ? '修改应用名称' : '添加应用',
      initialValues,
      schema: [
        {
          type: 'Input',
          name: 'name',
          label: '应用名称',
          required: true,
        },
      ],
    }).open({
      onSubmit: async (values) => {
        await axios.post(
          initialValues.id ? '/codeproject/update' : '/codeproject/add',
          {
            ...initialValues,
            ...values,
          },
        );
        query();
      },
    });
  };
  const query = async () => {
    setSpin(true);
    const {
      data: { code, data },
    } = await axios.post('/codeproject/list', {
      pageSize: 100,
    });
    if (code === 200) {
      setList(data.data);
    }
    setSpin(false);
  };
  useEffect(() => {
    query();
  }, []);
  const [pid, setPid] = useState(searchParams.pid);
  return (
    <Spin spinning={spin}>
      <div className="app-dashboard">
        <div className="app-dashboard-left">
          {list.map((item: any) => {
            return (
              <div
                key={item.id}
                className={
                  item.id === pid
                    ? 'app-dashboard-left-item-selected'
                    : 'app-dashboard-left-item'
                }
                onClick={() => {
                  history.pushState({}, '', `#/dashboard?pid=${item.id}`);
                  setPid(item.id);
                }}
              >
                {item.name}
              </div>
            );
          })}
          <div
            className="app-dashboard-left-add"
            onClick={() => {
              // addOrUpdate();
            }}
          >
            <Icon type="add" size={20} />
          </div>
        </div>
        <div className="app-dashboard-right">
          <Component key={pid} searchParams={{ pid }} />
        </div>
      </div>
    </Spin>
  );
};
