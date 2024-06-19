import { Button } from 'lyr-component';
import { Message, Upload } from '@arco-design/web-react';
import { downloadFile } from 'lyr-extra';
import { IconClose } from '@arco-design/web-react/icon';
import store from '@/store';

export default ({
  component,
  setComponent,
  selectedTab,
  setSelectedTab,
  onAdd,
  extra,
}) => {
  const { reactChange } = store.useSnapshot();
  return (
    <div className="cloud-component-right-header">
      <div className="cloud-component-tabs">
        {component.map((item) => {
          return (
            item.open &&
            [
              {
                icon: <i className="file-icon javascript-lang-file-icon" />,
                name: 'index.js',
                content: item.react,
                change: reactChange,
              },
              {
                icon: <i className="file-icon less-lang-file-icon" />,
                name: 'index.less',
                content: item.less,
              },
              {
                icon: <i className="file-icon json-lang-file-icon" />,
                name: 'props.json',
                content: item.meta,
              },
            ].map((file) => {
              return (
                <div
                  onClick={() => {
                    setSelectedTab(file.name);
                  }}
                  className={
                    selectedTab === file.name
                      ? 'cloud-component-tabs-item-selected'
                      : 'cloud-component-tabs-item'
                  }
                  key={file.name}
                >
                  {file.icon}
                  {file.name}
                  {file.change && (
                    <svg viewBox="0 0 1024 1024" width="20" height="20">
                      <path
                        d="M512 298.666667c117.333333 0 213.333333 96 213.333333 213.333333s-96 213.333333-213.333333 213.333333-213.333333-96-213.333333-213.333333S394.666667 298.666667 512 298.666667z"
                        fill="#e6e6e6"
                      ></path>
                    </svg>
                  )}
                  <span
                    className="close-icon"
                    onClick={(e) => {
                      if (reactChange) {
                        const res = confirm('当前文件未保存，是否确认关闭?');
                        if (!res) {
                          return;
                        }
                      }
                      e.stopPropagation();
                      item.open = false;
                      item.selected = false;
                      setComponent([...component]);
                    }}
                  >
                    <IconClose />
                  </span>
                </div>
              );
            })
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        {extra}
        <Button
          spin
          type="primary"
          size="small"
          onClick={async () => {
            const url = URL.createObjectURL(
              new Blob(JSON.stringify(component, null, 2).split('')),
            );
            await downloadFile(url, `${new Date().toLocaleTimeString()}.json`);
          }}
        >
          导出
        </Button>
        <Upload
          accept=".json"
          onChange={async (fileList, file) => {
            if (file.status === 'done') {
              open();
              await new Promise((res) => setTimeout(res, 1000));
              try {
                const jsonArr = JSON.parse(
                  await (file.originFile as any).text(),
                );
                if (Array.isArray(jsonArr)) {
                  // 去重
                  jsonArr.forEach((jsonItem) => {
                    // 剔除部分属性
                    delete jsonItem.open;
                    delete jsonItem.selected;
                    if (
                      !component.some((comp) => {
                        return comp.componentName === jsonItem.componentName;
                      })
                    ) {
                      onAdd(jsonItem);
                      component.push(jsonItem);
                    }
                  });
                  setComponent([...component]);
                } else {
                  Message.warning('导入失败');
                }
              } catch (err: any) {
                Message.warning(err);
              }
            }
          }}
        >
          <Button type="primary" size="small">
            导入
          </Button>
        </Upload>
      </div>
    </div>
  );
};
