import { Button } from 'react-core-form';
import { Message, Upload } from '@arco-design/web-react';
import { downloadFile } from 'react-core-form-tools';
import { IconClose, IconFile } from '@arco-design/web-react/icon';

export default ({
  component,
  setComponent,
  selectedTab,
  setSelectedTab,
  onAdd,
  extra,
}) => {
  return (
    <div className="cloud-component-right-header">
      <div className="cloud-component-tabs">
        {component.map((item) => {
          return (
            item.open &&
            [
              {
                icon: <IconFile />,
                name: 'index.js',
                content: item.react,
              },
              {
                icon: <IconFile />,
                name: 'index.less',
                content: item.less,
              },
              {
                icon: <IconFile />,
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
                  <span
                    className="close-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      // 关闭之后默认选中第一个打开的
                      const opens = component.filter(
                        (i) => i.open && i.componentName !== item.componentName,
                      );
                      if (item.selected && opens[0]) {
                        opens[0].selected = true;
                      }
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
                const jsonArr = JSON.parse(await (file.originFile as any).text());
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
              } finally {
                close();
              }
            }
          }}
        >
          <Button type="primary" size="small">
            导入
          </Button>
        </Upload>
        {extra}
      </div>
    </div>
  );
};
