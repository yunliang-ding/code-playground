import { useState } from 'react';
import { CodeEditor } from 'react-core-form-code-editor';
import { IconFindReplace } from '@arco-design/web-react/icon';

export default ({ historys }) => {
  const [code, setCode]: any = useState(historys[0]);
  return (
    <div style={{ display: 'flex', height: '100%', width: '100%' }}>
      <div className="code-history-left">
        {historys.map((item: any) => {
          return (
            <div
              onClick={() => {
                setCode(item);
              }}
              key={item.createTime}
              className={
                code.createTime === item.createTime
                  ? 'code-history-left-item-selected'
                  : 'code-history-left-item'
              }
            >
              <IconFindReplace style={{ color: '#1890ff' }} />
              {new Date(item.createTime).toLocaleString()}
            </div>
          );
        })}
      </div>
      {code.createTime && (
        <div className="code-history-right">
          <div className="code-history-right-react">
            <CodeEditor
              mode="diff"
              originalValue={code.before.react}
              value={code.after.react}
              key={code.createTime}
            />
          </div>
          <div className="code-history-right-less">
            <CodeEditor
              mode="diff"
              language="less"
              originalValue={code.before.less}
              value={code.after.less}
              key={code.createTime}
            />
          </div>
          <div className="code-history-right-props">
            <CodeEditor
              mode="diff"
              language="json"
              originalValue={JSON.stringify(
                JSON.parse(code.before.props),
                null,
                2,
              )}
              value={JSON.stringify(JSON.parse(code.after.props), null, 2)}
              key={code.createTime}
            />
          </div>
        </div>
      )}
    </div>
  );
};
