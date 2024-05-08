/** 资源包 */
import { CreateDrawer, SchemaProps } from 'lyr-component';
import { IconPlus } from '@arco-design/web-react/icon';
import { CodeEditor } from 'lyr-code-editor';

const iconMapping = {
  'less': "javascript-lang-file-icon",
  'javascript': "javascript-lang-file-icon",
  'react': "javascriptreact-lang-file-icon"
}

const schema = [
  {
    widget: 'Input',
    name: 'name',
    label: '资源名称',
    extra: '如果资源是umd包，请确保资源名称和window挂载的属性一致',
    required: true,
    rules: [
      {
        pattern: /^[A-Za-z0-9]+$/,
        message: '资源名称仅能用大小写字母或数字',
      },
    ],
    props: {
      autoComplete: 'off',
      autoFocus: true,
    },
  },
  {
    widget: 'RadioGroup',
    name: 'type',
    label: '类型',
    props: {
      options: [
        {
          label: 'Less',
          value: 'less',
        },
        {
          label: 'Javascript',
          value: 'javascript',
        },
        {
          label: 'React',
          value: 'react',
        },
      ],
    },
  },
  {
    widget: 'RadioGroup',
    label: '上传格式',
    name: 'codeWay',
    props: {
      options: [
        {
          label: '代码编写',
          value: 1,
        },
        {
          label: '文件上传',
          value: 2,
        },
      ],
    },
  },
  {
    widget: 'CodeEditor',
    name: 'content',
    label: '编写脚本',
    required: true,
    effect: ['type', 'codeWay'],
    visible({ codeWay }) {
      return codeWay === 1;
    },
    onEffect: (e, form) => {
      form.setSchemaByName('content', {
        props: {
          language: {
            less: 'less',
            javascript: 'javascript',
            react: 'javascript',
          }[form.getFieldValue('type')],
        } as any,
      } as any);
    },
    props: {
      style: {
        width: '100%',
        height: 300,
      },
      minimapEnabled: false,
    },
  },
  {
    widget: 'OssFileUpload',
    name: 'ossPath',
    label: '上传脚本',
    required: true,
    effect: ['codeWay'],
    visible({ codeWay }) {
      return codeWay === 2;
    },
    props: {
      maxCount: 1,
      accept: '.js',
    },
  },
] as SchemaProps[];

export default ({ dependencies, setDependencies, onAddDep, onUpdateDep }) => {
  const depModalForm = CreateDrawer({
    drawerProps: {
      bodyStyle: {
        paddingBottom: 0,
        paddingTop: 16,
      },
      placement: 'left',
    },
    initialValues: {
      type: 'javascript',
      codeWay: 1,
    },
    schema,
    widgets: {
      CodeEditor,
    },
    onSubmit: async (values) => {
      const res = await onAddDep(values);
      if (res?.id) {
        dependencies.push({
          ...res,
          ...values,
        });
        setDependencies([...dependencies]);
      } else {
        return Promise.reject();
      }
    },
  });
  return (
    <>
      <div className="cloud-component-left-header">
        <span>配置依赖脚本</span>
        <IconPlus
          onClick={() => {
            depModalForm.open({
              title: '添加脚本',
            });
          }}
        />
      </div>
      <div className="cloud-component-assets">
        <div className="cloud-component-assets-files">
          {dependencies.map((item) => {
            return (
              <div
                key={item.name}
                className="cloud-component-assets-files-file"
                onClick={() => {
                  depModalForm.open({
                    title: `更新脚本《${item.name}》`,
                    initialValues: {
                      ...item,
                    },
                    onSubmit: async (values) => {
                      const res = await onUpdateDep({
                        ...item,
                        ...values,
                      });
                      if (res) {
                        Object.assign(item, values);
                        setDependencies([...dependencies]);
                      } else {
                        return Promise.reject();
                      }
                    },
                  });
                }}
              >
                <i className={`file-icon ${iconMapping[item.type]}`} />
                <span style={{ color: '#ddd' }}>{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
