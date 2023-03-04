import { useState, memo } from 'react';
import { CodeEditor, getTools } from 'react-core-form-designer';
import './index.less';

const { encode, decode } = getTools();

const defualtCode = `export default () => {
  return 'hello world';
}`;

export default () => {
  const params: any = new URLSearchParams(location.hash.split('?')[1]);
  const [code, setCode] = useState(
    params.get('code') ? decode(params.get('code')) : defualtCode,
  );
  return (
    <div className="playground">
      <div className="playground-left">
        <CacheEditor
          code={code}
          setCode={(code) => {
            setCode(code);
            window.parent.postMessage(
              {
                type: 'playground',
                content: code,
              },
              '*',
            );
          }}
        />
      </div>
      <div className="playground-right">
        <iframe
          key={code}
          src={`/#/preview?code=${encode(code)}`}
        />
      </div>
    </div>
  );
};

const CacheEditor = memo(
  ({ code, setCode }: any) => {
    return (
      <CodeEditor
        style={{
          width: '50vw',
          height: '100vh',
        }}
        value={code}
        onSave={setCode}
      />
    );
  },
  () => {
    return true;
  },
);
