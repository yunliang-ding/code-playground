/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Spin } from 'antd';
import './index.less';

export default ({ logs }) => {
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
