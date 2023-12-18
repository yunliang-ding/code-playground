import { request } from '@/axios';
import { useEffect, useState } from 'react';
import { setUser } from '@/util';
import { Outlet } from 'react-router-dom';
import { Spin } from '@arco-design/web-react';
import './index.less';

export default () => {
  const [spin, setSpin] = useState(true);
  const [show, setShow] = useState(false);
  const queryUser = async () => {
    const {
      data: { code, data },
    } = await request.post('/user/info');
    setSpin(false);
    if (code === 200) {
      setShow(true);
      setUser(JSON.stringify(data));
    }
  };
  useEffect(() => {
    queryUser();
  }, []);
  return show ? (
    <Spin loading={spin}>
      <div className="playground show-file-icons">
        <div className="playground-body">
          <Outlet />
        </div>
      </div>
    </Spin>
  ) : null;
};
