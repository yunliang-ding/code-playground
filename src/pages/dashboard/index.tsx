import { CreateModal, Icon } from 'react-core-form';
import axios from '@/axios';
import './index.less';

export default () => {
  const addOrUpdate = async (initialValues = {
    id: undefined
  }  as any) => {
    CreateModal({
      title: initialValues.id ? '修改类目' : '添加类目',
      initialValues,
      schema: [
        {
          type: 'Input',
          name: 'name',
          label: '类目名称',
          required: true,
        },
      ],
    }).open({
      onSubmit: async () => {
        axios.post('/codeproject/add', {});
      },
    });
  };
  return (
    <div className="app">
      <div className="app-dashboard">
        {[
          {
            id: 1,
            name: '算法集',
            createTime: Date.now(),
            count: 5,
          },
          {
            id: 2,
            name: '面试集',
            createTime: Date.now(),
            count: 5,
          },
          {
            id: 3,
            name: '业务组件集',
            createTime: Date.now(),
            count: 13,
          },
        ].map((item) => {
          return (
            <div key={item.id} className="app-dashboard-item">
              <span>
                {item.name}&nbsp;&nbsp;({item.count})
              </span>
              {new Date(item.createTime).toLocaleString()}
              <a className="actions" onClick={() => {
                addOrUpdate(item)
              }}>修改</a>
            </div>
          );
        })}
        <div className="app-dashboard-add" onClick={addOrUpdate}>
          <Icon type="add" size={20} />
        </div>
      </div>
    </div>
  );
};
