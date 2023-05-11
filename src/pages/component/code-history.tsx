import { CodeEditor } from 'react-core-form';
import { FieldTimeOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
// import axios from '@/axios';

export default ({ tabType, componentId }: any) => {
  const [history, setHistory]: any = useState([]);
  const [code, setCode]: any = useState({});
  useEffect(() => {
    setHistory([])
  }, [])
  return (
    <div style={{ display: 'flex', height: '100%', width: '100%' }}>
      <div className="code-history-left">
        {history.map((item: any) => {
          return (
            <div
              onClick={() => {
                setCode(item);
              }}
              key={item.time}
              className={
                code.time === item.time
                  ? 'code-history-left-item-selected'
                  : 'code-history-left-item'
              }
            >
              <FieldTimeOutlined style={{ color: '#1890ff' }} />
              {item.time}
            </div>
          );
        })}
      </div>
      <div className="code-history-right">
        <CodeEditor
          mode="diff"
          originalValue={code.before}
          value={code.after}
          key={code.time}
        />
      </div>
    </div>
  );
};
