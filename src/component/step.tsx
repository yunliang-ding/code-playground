/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { sleep } from '@/pages/component';
import { Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import './index.less';

export default ({ stepRef = useRef({}) }: any) => {
  const [logs, setLogs]: any = useState(['资源加载中..']);
  const updateLogs = async (log, timer = 500) => {
    await sleep(timer);
    logs.push(log);
    setLogs([...logs]);
  };
  useEffect(() => {
    stepRef.current.updateLogs = updateLogs;
  }, []);
  return (
    <div className="app-step-logs">
      <pre>
        {logs.map((log) => {
          return <p key={log}>{log}</p>;
        })}
        <Spin spinning />
      </pre>
    </div>
  );
};
