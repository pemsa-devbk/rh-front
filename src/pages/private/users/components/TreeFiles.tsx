import React, { useState } from 'react'
import { Button, Drawer, Dropdown, Form, Input, MenuProps, message, Modal, Space, Tree, TreeDataNode, Typography, Upload } from 'antd';
import { EventDataNode } from 'antd/es/tree';
import { FilePdfTwoTone, UploadOutlined } from '@ant-design/icons';
import { NotificationInstance } from 'antd/es/notification/interface';
import { getFiles } from '../../../../api/file';
import { useCreateDirectory, useDeleteFile, useRenameFile } from '../../../../hooks/file';
import { instance } from '../../../../api/rh';

interface Props {
  id: string;
  api: NotificationInstance;
}
interface ResponseData {
  name: string;
  type: 'directory' | 'file';
}

// TODO Colocar iconos
function transformData(data: Array<ResponseData>, parentPath = ''): Array<TreeDataNode> {
  return data.map(item => {
    const fullPath = `${parentPath}/${item.name}`.replace(/\/+/g, '/');

    return {
      title: item.name,
      key: fullPath,           // Ruta completa
      isLeaf: item.type === 'file',
      icon: (item.type === 'file') ? <FilePdfTwoTone twoToneColor={'#F00'} /> : null
    };
  })
}

interface ContextMenuState {
  visible: boolean;
  node: EventDataNode<TreeDataNode>;
}

export const TreeFiles = ({ id, api }: Props) => {

  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [open, setOpen] = useState(false);

  const [treeData, setTreeData] = useState<Array<TreeDataNode>>([{ title: '/', key: '/', disabled: true }]);

  const { mutate: deleteFile } = useDeleteFile();
  const { mutate: renameFile } = useRenameFile();
  const { mutate: createDirectoryFile } = useCreateDirectory();

  const [form] = Form.useForm();
  const [formDirectory] = Form.useForm();


  const fetchNode = async (key: React.Key) => {
    const data = await getFiles(id!, key.toString());
    const format = transformData(data, key.toString());
    return format;
  }

  const handleFormSubmit = (values: any) => {
    values['from'] = `${id}${contextMenu?.node.key}`;
    renameFile(values, {
      async onSuccess(data, variables, context) {
        await updateTreeNodeByKey(getParentKey(contextMenu!.node.key), fetchNode, setTreeData)
      },
    });
  }

  const handleFormDirectorySubmit = (values: any) => {
    values['dir'] = `${id}${contextMenu?.node.key}/${values.dir}`;
    createDirectoryFile(values, {
      async onSuccess(data, variables, context) {
        await updateTreeNodeByKey(contextMenu!.node.key, fetchNode, setTreeData)
      },
    })
  }

  const openNotification = (context: ContextMenuState, callback: (node: EventDataNode<TreeDataNode>, close: () => void) => void) => {
    const key = `open${Date.now()}`;
    const btn = (
      <Space>
        <Button type="text" size="small" onClick={() => api.destroy(key)}>
          Cancel
        </Button>
        <Button type="primary" size="small" onClick={() => callback(context.node, () => api.destroy(key))}>
          Eliminar
        </Button>
      </Space>
    );

    api.open({
      message: `Desea eliminar el ${context.node.isLeaf ? 'archivo' : 'directorio'} ${context.node.title}`,
      description:
        'No podrá revertir esta acción',
      actions: btn,
      key,
      role: 'alert',
      type: 'warning'
    });
  }

  const items: MenuProps['items'] = [
    {
      label: 'Descargar',
      key: '1',
      disabled: !contextMenu?.visible
    },
    {
      label: 'Eliminar',
      disabled: (contextMenu?.node.key.toString() === '/'),
      key: '2',
      onClick: () => {
        openNotification(contextMenu!, hanldeDeleteFile);
      },
    },
    {
      label: 'Cambiar nombre',
      key: '3',
      onClick: () => {
        Modal.warning({
          title: `Cambiar nombre del ${contextMenu?.node.isLeaf ? 'archivo' : 'directorio'} ${contextMenu?.node.title}`,
          content: (
            <Form form={form} layout='vertical' onFinish={handleFormSubmit}>
              <Form.Item
                name='to'
                label="Nuevo nombre"
                rules={[{ required: true, message: 'El nuevo nombre es obligatorio' }]}
              >
                <Input placeholder='Nuevo nombre' />
              </Form.Item>
            </Form>
          ),
          onOk() {
            form.submit();
          },
          closable: true
        })
      }
    },
    {
      label: 'Subir archivos',
      key: '4',
      disabled: contextMenu?.visible,
      onClick: () => setOpen(true)
    },
    {
      label: 'Crear directorio',
      key: '5',
      disabled: contextMenu?.visible,
      onClick: () => {
        Modal.warning({
          title: `Crear directorio en ${contextMenu?.node.title}`,
          content: (
            <Form form={formDirectory} layout='vertical' onFinish={handleFormDirectorySubmit}>
              <Form.Item
                name='dir'
                label="Nombre"
                rules={[{ required: true, message: 'El nuevo nombre es obligatorio' }]}
              >
                <Input placeholder='Nombre' />
              </Form.Item>
            </Form>
          ),
          onOk() {
            formDirectory.submit();
          },
          closable: true
        })
      }
    }
  ];




  // * fucntions file
  const hanldeDeleteFile = (node: EventDataNode<TreeDataNode>, close?: () => void) => {
    deleteFile({ id: id!, path: node.key.toString() }, {
      async onSuccess() {
        close && close();
        await updateTreeNodeByKey(getParentKey(node.key), fetchNode, setTreeData)
      },
    })
  }

  const getParentKey = (key: React.Key) => {
    const segments = key.toString().split('/').filter(Boolean); // Elimina strings vacíos
    if (segments.length <= 1) return '/';
    return '/' + segments.slice(0, -1).join('/');
  }

  const updateTreeNodeByKey = async (
    key: React.Key,
    fetchChildren: (key: React.Key) => Promise<TreeDataNode[]>,
    setTreeData: React.Dispatch<React.SetStateAction<TreeDataNode[]>>,
  ) => {
    const children = await fetchChildren(key);
    setTreeData(prev =>
      replaceNodeChildren(prev, key, children)
    );
  };

  function mergeNodeChildrenDiff(
    oldChildren: TreeDataNode[] = [],
    newChildren: TreeDataNode[] = []
  ): TreeDataNode[] {
    const oldMap = new Map(oldChildren.map(n => [n.key, n]));
    const newMap = new Map(newChildren.map(n => [n.key, n]));

    const merged: TreeDataNode[] = [];

    // Agregar o mantener nodos
    for (const [key, newNode] of newMap) {
      if (oldMap.has(key)) {
        // Mantener el viejo (preserva hijos)
        merged.push(oldMap.get(key)!);
      } else {
        // Agregar nuevo nodo
        merged.push(newNode);
      }
    }
    return merged;
  }

  function replaceNodeChildren(
    nodes: TreeDataNode[],
    key: React.Key,
    newChildren: TreeDataNode[]
  ): TreeDataNode[] {
    return nodes.map(node => {
      if (node.key === key) {
        return {
          ...node,
          children: mergeNodeChildrenDiff(node.children, newChildren),
        };
      }
      if (node.children) {
        return {
          ...node,
          children: replaceNodeChildren(node.children, key, newChildren),
        };
      }
      return node;
    });
  }

  // * Load data
  const loadData = async (node: EventDataNode<TreeDataNode>) => {
    const format = await fetchNode(node.key);
    setTreeData((origin) =>
      updateTreeData(origin, node.key, format)
    );
  };

  const updateTreeData = (list: Array<TreeDataNode>, key: React.Key, children: Array<TreeDataNode>): Array<TreeDataNode> =>
    list.map((node) =>
      node.key === key
        ? { ...node, children }
        : node.children
          ? { ...node, children: updateTreeData(node.children, key, children) }
          : node
    );

  const handleCustomRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append('documents', file);

    try {
      await instance.post(`/files/upload/${id}/${contextMenu?.node.key.toString()}`, formData);
      message.success('Archivo subido correctamente');
      onSuccess();
    } catch (err) {
      message.error('Error al subir archivo');
      onError(err);
    }
  };

  const onClose = () => {
    setOpen(false);
  }
  return (
    <>
      <Dropdown menu={{ items }} trigger={['contextMenu']}>
        <Tree.DirectoryTree
          loadData={loadData}
          treeData={treeData}
          onRightClick={({ event, node }) => {
            setContextMenu({ node: node, visible: node.isLeaf || false });
          }}
        />
      </Dropdown>

      <Drawer
        title={`Subir archivos a ${contextMenu?.node.title}`}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
          </Space>
        }
      >
        <Space direction="vertical" size="large">
          <Typography.Text>Archivos a subir: </Typography.Text>
          <Upload
            name="documents"
            multiple
            customRequest={(options) => handleCustomRequest(options)}
          >
            <Button type="primary" icon={<UploadOutlined />}>
              Subir
            </Button>
          </Upload>

        </Space>

      </Drawer>

    </>
  )
}
