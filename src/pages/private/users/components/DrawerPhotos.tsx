import React from 'react'
import { instance } from '../../../../api/rh';
import { Button, Drawer, message, Space, Typography, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';


interface Props{
    onClose: () => void; 
    open: boolean;
    id: string;
    setUpdatePhoto: React.Dispatch<React.SetStateAction<{ foto: number; firma: number;}>>
}
export const DrawerPhotos = ({id, onClose, open, setUpdatePhoto}:Props) => {


    const handleCustomRequest = async (options: any, type: string) => {
        const { file, onSuccess, onError } = options;
        const formData = new FormData();
        formData.append(type, file);

        try {
            await instance.put(`/users/${id}/${type}`, formData);
            message.success('Archivo subido correctamente');
            onSuccess(true);
            setUpdatePhoto((old) => ({ ...old, [type]: Date.now() }))
        } catch (err) {
            console.error(err);
            message.error('Error al subir archivo');
            onError(err);
        }
    };
    return (
        <Drawer
            title="Editar fotos"
            onClose={onClose}
            open={open}
            extra={
                <Space>
                    <Button onClick={onClose}>Cancel</Button>
                </Space>
            }
        >
            <Space direction="vertical" size="large">
                <Typography.Text>Foto: </Typography.Text>
                <Upload
                    name="foto"
                    listType="picture"
                    maxCount={1}
                    customRequest={(options) => handleCustomRequest(options, 'foto')}
                    beforeUpload={(file) => {
                        const isPNG = file.type === 'image/png' || file.type === 'image/jpeg';
                        if (!isPNG) {
                            message.error(`${file.name} no es un formato soportado`);
                        }
                        return isPNG || Upload.LIST_IGNORE;
                    }}
                >
                    <Button type="primary" icon={<UploadOutlined />}>
                        Actualizar
                    </Button>
                </Upload>

                <Typography.Text>Firma: </Typography.Text>
                <Upload
                    name="firma"
                    listType="picture"
                    maxCount={1}
                    customRequest={(options) => handleCustomRequest(options, 'firma')}
                    beforeUpload={(file) => {
                        const isPNG = file.type === 'image/png' || file.type === 'image/jpeg';
                        if (!isPNG) {
                            message.error(`${file.name} no es un formato soportado`);
                        }
                        return isPNG || Upload.LIST_IGNORE;
                    }}
                >
                    <Button type="primary" icon={<UploadOutlined />}>
                        Actualizar
                    </Button>
                </Upload>

            </Space>

        </Drawer>
    )
}
