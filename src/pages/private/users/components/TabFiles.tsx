import { FilePdfTwoTone, UploadOutlined } from '@ant-design/icons';
import { Button, Drawer, Dropdown, Form, Input, message, Modal, Space, Tree, TreeDataNode, Typography, Upload } from 'antd';
import { EventDataNode } from 'antd/es/tree';
import React, { useState } from 'react'
import { downloadFile, getFiles, uploadFiles } from '../../../../api/file';
import { useCreateDirectory, useDeleteFile, useRenameFile } from '../../../../hooks/file';
import { NotificationInstance } from 'antd/es/notification/interface';

interface Props {
    id?: string;
    api: NotificationInstance;
}

interface ResponseData {
    name: string;
    type: 'directory' | 'file';
}
interface ContextMenuState {
    visible: boolean;
    node: EventDataNode<TreeDataNode>;
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

function updateTreeData(list: TreeDataNode[], key: React.Key, children: TreeDataNode[]): TreeDataNode[] {
    return list.map((node) => {
        if (node.key === key) {
            return {
                ...node,
                children,
            };
        }
        if (node.children) {
            return {
                ...node,
                children: updateTreeData(node.children, key, children),
            };
        }
        return node;
    });
}


export const TabFiles = ({ id, api }: Props) => {
    const { mutate: createDirectoryFile } = useCreateDirectory();
    const { mutate: renameFile } = useRenameFile();
    const { mutate: deleteFile } = useDeleteFile();
    const [contextMenu, setContextMenu] = useState<ContextMenuState>();
    const [treeData, setTreeData] = useState<TreeDataNode[]>([
        {
            key: '',
            title: id,
            disabled: true
        }
    ]);
    const [open, setOpen] = useState(false);
    const [formDirectory] = Form.useForm();
    const [form] = Form.useForm();

    const onLoadData = (key: React.Key) => {
        return new Promise<void>((resolve) => {
            getFiles(id!, key.toString())
                .then(data => {
                    const archives = transformData(data, key.toString());
                    setTreeData((origin) =>
                        updateTreeData(origin!, key, archives),
                    );
                    resolve();
                })
        });
    }

    const download = async (context: ContextMenuState) => {
        console.log(context.node.key);
        const filename: string = context.node.key.toString().split('/').pop()!;
        downloadFile(id!, context.node.key.toString())
            .then(data => {
                // Crear URL temporal
                const url = window.URL.createObjectURL(new Blob([data]));
                // Crear <a> oculto para disparar la descarga
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', filename); // nombre sugerido
                document.body.appendChild(link);
                link.click();

                // Limpieza
                link.remove();
                window.URL.revokeObjectURL(url);
            })
    };

    const onClose = () => {
        setOpen(false);
    }

    const handleCustomRequest = async (options: any) => {
        const { file, onSuccess, onError } = options;
        const formData = new FormData();
        formData.append('documents', file);

        try {
            await uploadFiles(id!, contextMenu!.node.key.toString(), formData);
            message.success('Archivo subido correctamente');
            await onLoadData(contextMenu!.node.key)
            onSuccess();
        } catch (err) {
            message.error('Error al subir archivo');
            onError(err);
        }
    };

    const handleFormDirectorySubmit = (values: any) => {
        values['dir'] = `${id}${contextMenu?.node.key}/${values.dir}`;
        createDirectoryFile(values, {
            async onSuccess(data, variables, context) {
                await onLoadData(contextMenu!.node.key)
            },
        })
    }

    const handleFormSubmit = (values: any) => {
        const fullPath = `${contextMenu?.node.key}`;
        values['from'] = `${id}${fullPath}`;
        const splitPath = fullPath.split('/');
        const parentKey = splitPath.slice(0, splitPath.length - 1).toString();
        renameFile(values, {
            async onSuccess(data, variables, context) {
                const key: React.Key = parentKey;
                await onLoadData(key);
            },
        });
    }

    const hanldeDeleteFile = (node: EventDataNode<TreeDataNode>, close?: () => void) => {
        const fullPath = `${contextMenu?.node.key}`;
        const splitPath = fullPath.split('/');
        const parentKey = splitPath.slice(0, splitPath.length - 1).toString();
        deleteFile({ id: id!, path: node.key.toString() }, {
            async onSuccess() {
                close && close();
                const key: React.Key = parentKey;
                await onLoadData(key);
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

    return (
        <>
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
            <Dropdown menu={{
                items: [
                    {
                        label: 'Descargar',
                        key: '1',
                        disabled: !contextMenu?.visible,
                        onClick: () => {
                            download(contextMenu!);
                        }
                    },
                    {
                        label: 'Subir archivos',
                        key: '2',
                        disabled: contextMenu?.visible,
                        onClick: () => setOpen(true)
                    },
                    {
                        label: 'Renombrar',
                        key: '3',
                        disabled: contextMenu?.visible,
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
                        label: 'Crear directorio',
                        key: '4',
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
                    },
                    {
                        label: 'Eliminar',
                        key: '5',
                        onClick: () => {
                            openNotification(contextMenu!, hanldeDeleteFile);
                        }
                    },
                    {
                        label: 'Actualizar',
                        key: '6',
                        onClick: () => {
                            onLoadData(contextMenu!.node.key);
                        }
                    }
                ]
            }} trigger={['contextMenu']}>
                <Tree.DirectoryTree loadData={({ key }) => onLoadData(key)} treeData={treeData} onRightClick={({ event, node }) => {
                    setContextMenu({ node: node, visible: node.isLeaf || false });
                }} />
            </Dropdown>
        </>
    )
}
