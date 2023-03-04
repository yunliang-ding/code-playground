import { useEffect } from 'react';
import ReactDom from 'react-dom';
import * as reactCoreForm from 'react-core-form';
import * as reactCoreFormDesigner from 'react-core-form-designer';

const { babelParse, decode } = reactCoreFormDesigner.getTools();

export default () => {
  const params: any = new URLSearchParams(location.hash.split('?')[1]);
  // 解析
  const parseStringToModule = async () => {
    try {
      const ComponentApp = await babelParse({
        // base64 转一下
        code: decode(params.get('code')),
        prefix: '',
        require: {
          'react-core-form': reactCoreForm,
          'react-core-form-designer': reactCoreFormDesigner,
        },
      });
      ReactDom.render(
        <ComponentApp />,
        document.querySelector('.playground-iframe-app'),
      );
    } catch (error) {
      ReactDom.render(
        <div className="playground-error-info">
          <div>解析失败:</div>
          <pre>{String(error)}</pre>
        </div>,
        document.querySelector('.playground-iframe-app'),
      );
    }
  };
  useEffect(() => {
    if (params.get('code')) {
      parseStringToModule();
    }
  }, []);
  const logInstance = reactCoreForm.ConsoleRender.create({
    target: '.playground-iframe-console-body',
  });
  useEffect(() => {
    // 监听日志打印
    logInstance.listener();
  }, []);
  return (
    <div className="playground-iframe">
      <div className="playground-iframe-app" />
      <div className="playground-iframe-console">
        <div className="playground-iframe-console-header">控制台结果</div>
        <div className="playground-iframe-console-body" />
      </div>
    </div>
  );
};
