import React, { useEffect } from 'react';
import { CodeEditor } from 'lyr-code-editor';
import Tabs from './tabs';
import store from '@/store';

const Container = ({ selectedTab, item, require, previewRender }) => {
  const codeRef1: any = React.useRef({});
  const codeRef2: any = React.useRef({});
  const codeRef3: any = React.useRef({});
  useEffect(() => {
    setTimeout(() => {
      (window as any).monaco?.editor.setTheme("vs-dark");
    })
  }, [])
  return (
    <div
      className="cloud-component-right-body"
      style={{
        display: item.selected ? 'flex' : 'none',
      }}
    >
      <div
        style={{ display: selectedTab === 'index.js' ? 'block' : 'none' }}
        className="cloud-component-right-body-react"
      >
        <CodeEditor
          mode="function"
          require={require}
          codeRef={codeRef1}
          value={item.react}
          onChange={(code) => {
            item.react = code;
            store.reactChange = item.originReact !== code;
          }}
        />
      </div>

      <div
        style={{
          display: selectedTab === 'index.less' ? 'block' : 'none',
        }}
        className="cloud-component-right-body-less"
      >
        <CodeEditor
          mode="less"
          value={item.less}
          codeRef={codeRef2}
          onChange={(code) => {
            item.less = code;
          }}
        />
      </div>
      <div
        style={{
          display: selectedTab === 'props.json' ? 'block' : 'none',
        }}
        className="cloud-component-right-body-props"
      >
        <CodeEditor
          mode="json"
          value={item.props}
          codeRef={codeRef3}
          onChange={() => {
            item.props = codeRef3.current.getJson2Object();
          }}
        />
      </div>
      {previewRender(item)}
    </div>
  );
};

export default (props) => {
  return (
    <>
      <Tabs {...props} />
      <Container {...props} />
    </>
  );
};
