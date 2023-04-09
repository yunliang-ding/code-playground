/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Spin } from 'antd';
import './index.less';

export default ({ logs }) => {
  return (
    <div className="app-step-logs">
      <pre>
        {logs.map((log, index) => {
          return (
            <p key={log}>
              {index + 1}: {log}
            </p>
          );
        })}
        <Spin spinning />
      </pre>
    </div>
  );
};
