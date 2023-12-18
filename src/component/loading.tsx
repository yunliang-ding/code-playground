import { Spin } from '@arco-design/web-react';

export default () => {
  return (
    <Spin
      size={40}
      style={{
        background: '#eee',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  );
};
