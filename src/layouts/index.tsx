import axios from '@/axios';
import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { useHistory } from 'ice'
import Login from '@/component/login';
import './index.less';

export default (props) => {
  if (props.location.pathname === '/component/preview') {
    return props.children;
  }
  if(localStorage.getItem('code-playground') === null){
    return <Login />
  }
  const history = useHistory();
  const [list, setList] = useState([]);
  const [spin, setSpin] = useState(true);
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
  const [pid, setPid]: any = useState(new URLSearchParams(props.location.search).get('pid') || 1);
  return (
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
        </div>
        <div className="app-dashboard-right" key={pid}>{props.children}</div>
      </div>
    </Spin>
  );
};
