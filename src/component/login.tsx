import instance from '@/axios';
import { Input, Modal } from 'antd';
import { useEffect, useRef } from 'react';
import { Button } from 'react-core-form';
import './index.less';

export default () => {
  const inputRef: any = useRef({});
  useEffect(() => {
    Modal.info({
      className: 'login-modal',
      icon: null,
      title: (
        <div>
          <h3>Welcome to Code Playground</h3>
          <span>Please log in below password</span>
        </div>
      ),
      content: (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignContent: 'center',
            gap: 10,
          }}
        >
          <Input.Password placeholder="PASSWORD" ref={inputRef} defaultValue='code-playground' />
          <Button
            spin
            type="primary"
            onClick={async () => {
              const res = await instance.post('/component/login', {
                password: inputRef.current.input.value,
              });
              await new Promise((res) => setTimeout(res, 500));
              if (res.data.code === 200) {
                localStorage.setItem('code-playground', '1');
                location.reload();
              }
            }}
          >
            Submit
          </Button>
        </div>
      ),
    });
  }, []);
  return null;
};
