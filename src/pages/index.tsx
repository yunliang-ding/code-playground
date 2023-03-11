import { useState, memo } from 'react';
import { CodeEditor } from 'react-core-form';
import { decode, encode } from 'react-core-form-tools';
import './index.less';

const defualtCode = `export default () => {
  return 'hello world';
}`;

export default ({
  searchParams
}) => {
  const [code, setCode] = useState(
    searchParams.code ? decode(searchParams.code) : defualtCode,
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
          src={`${location.pathname}#/preview?code=${encode(code)}`}
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
