import { CodeEditor } from 'lyr-code-editor';
import Tabs from './tabs';

const Container = ({ item, previewRender }) => {
  return (
    <div
      className="cloud-component-right-body"
      style={{
        display: item.selected ? 'flex' : 'none',
      }}
    >
      <div className="cloud-component-right-body-react">
        <CodeEditor
          language="markdown"
          value={item.react}
          minimapEnabled={false}
          onChange={(code) => {
            item.react = code;
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
