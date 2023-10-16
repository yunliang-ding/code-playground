import { instance, instance2 } from '@/axios';
import { useEffect, useState } from 'react';
import { Avatar, Spin } from 'antd';
import { useHistory } from 'ice';
import { clearUser, getUser, setUser } from '@/util';
import { Icon } from 'react-core-form';
import './index.less';

export default (props) => {
  if (props.location.pathname === '/component/preview') {
    return props.children;
  }
  const history = useHistory();
  const [list, setList] = useState([]);
  const [spin, setSpin] = useState(true);
  const [show, setShow] = useState(false);
  const queryUser = async () => {
    const {
      data: { code, data },
    } = await instance2.post('/user/info');
    if (code === 200) {
      setShow(true);
      setUser(JSON.stringify(data));
      query();
    }
  };
  const query = async () => {
    setSpin(true);
    const {
      data: { code, data },
    } = await instance.post('/codeproject/list', {
      pageSize: 100,
    });
    if (code === 200) {
      setList(data.data);
    }
    setSpin(false);
  };
  useEffect(() => {
    queryUser();
  }, []);
  const [pid, setPid]: any = useState(
    new URLSearchParams(props.location.search).get('pid') || 1,
  );
  return show ? (
    <Spin spinning={spin}>
      <div className="app-dashboard">
        <div className="app-dashboard-left">
          {list.map((item: any) => {
            return (
              <div
                key={item.id}
                className={
                  item.id === Number(pid)
                    ? 'app-dashboard-left-item-selected'
                    : 'app-dashboard-left-item'
                }
                onClick={() => {
                  history.push(`/component?pid=${item.id}`);
                  setPid(item.id);
                }}
              >
                {item.name}
              </div>
            );
          })}
          <div
            className="app-dashboard-left-item"
            style={{ position: 'absolute', bottom: 60 }}
          >
            <Avatar src={getUser()?.avatarUrl} size={30} />
          </div>
          <div
            className="app-dashboard-left-item"
            style={{ position: 'absolute', bottom: 0 }}
            onClick={() => {
              clearUser();
            }}
          >
            <Icon type="setting" size={20} />
          </div>
        </div>
        <div className="app-dashboard-right" key={pid}>
          {props.children}
        </div>
      </div>
    </Spin>
  ) : null;
};
