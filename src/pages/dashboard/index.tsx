import { CreateModal, Icon } from 'react-core-form';
import axios from '@/axios';
import './index.less';
import { useEffect, useState } from 'react';
import { Spin } from 'antd';

export default () => {
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
  return (
    <Spin spinning={spin}>
      <div className="app">
        <div className="app-dashboard">
          {list.map((item: any) => {
            return (
              <div
                key={item.id}
                className="app-dashboard-item"
                onClick={() => {
                  window.open(`#/component?pid=${item.id}`);
                }}
              >
                <span>{item.name}</span>
                {new Date(item.createTime).toLocaleString()}
                <a
                  className="actions"
                  onClick={(e) => {
                    e.stopPropagation();
                    addOrUpdate(item);
                  }}
                >
                  修改
                </a>
              </div>
            );
          })}
          <div
            className="app-dashboard-add"
            onClick={() => {
              addOrUpdate();
            }}
          >
            <Icon type="add" size={20} />
          </div>
        </div>
      </div>
    </Spin>
  );
};
