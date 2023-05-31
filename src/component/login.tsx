import { setUser } from '@/util';
import { Input, Modal } from 'antd';
import { useEffect, useRef } from 'react';
import { Button } from 'react-core-form';
import { isEmpty } from 'react-core-form-tools';
import './index.less';

export default () => {
  const inputRef: any = useRef({});
  const submit = async () => {
    await new Promise((res) => setTimeout(res, 500));
    if (!isEmpty(inputRef.current.input.value)) {
      setUser(inputRef.current.input.value);
      location.reload();
    }
  };
  useEffect(() => {
    Modal.info({
      className: 'login-modal',
      icon: null,
      title: (
        <div>
          <h3>欢迎使用 Code Playground</h3>
          <span>请在下方输入您的昵称</span>
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
          <Input
            placeholder="请输入昵称"
            ref={inputRef}
            onPressEnter={submit}
          />
          <Button spin type="primary" onClick={submit}>
            提交
          </Button>
        </div>
      ),
    });
  }, []);
  return null;
};
