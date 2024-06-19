import { Outlet } from 'react-router-dom';

export default () => {
  return (
    <div className="playground show-file-icons">
      <div className="playground-body">
        <Outlet />
      </div>
    </div>
  );
};
