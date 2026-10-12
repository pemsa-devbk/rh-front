import { useFilesByEmployee } from '../../../../hooks/file';
import { Alert, Button, Col, Flex, message, notification, Row, Skeleton, Space, Tooltip, Typography, Upload } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { CropUpload } from './CropUpload';
import { FileEmployee } from '../../../../api/interfaces/file';
import { downloadFile as downloadApi, uploadFile } from '../../../../api/file';
import { downloadFile } from '../../../../helpers/download';

interface Props {
    employeeID: string;
}

const SimpleUpload = ({ file: { key, valid_mime_types }, employeeID }: { file: FileEmployee, employeeID: string }) => {

    const beforeUpload = async ({file}: any) => {
        try {
            const formData = new FormData();
            formData.append(key, file);
            await uploadFile({ employeeID, body: formData })
            message.success('Archivo actualizado');
        } catch (error) {
            message.error('Error al subir el archivo');
        }finally{
            return 'ok';
        }
    }
    return <Upload
        maxCount={1}
        accept={valid_mime_types}
        showUploadList={false}
        // beforeUpload={beforeUpload}
        customRequest={beforeUpload}
        // action={beforeUpload}
    >
        <Button size='small' variant='filled' color='blue' icon={<UploadOutlined />} />
    </Upload>
}
export const TabFiles = ({ employeeID }: Props) => {
    const { data, isFetching, error } = useFilesByEmployee(employeeID, !!employeeID);

    if (isFetching)
        return <Skeleton loading={isFetching} />
    if (error)
        return <Alert type='error' message='Error al obtener información de archivos del empleado' />

    const handleDownloadFile = async ({file_id, name }: FileEmployee) => {
        try {
            const { blob, headers } = await downloadApi({ fileID: file_id, employeeID });
            downloadFile({ blob, headers, customFileName: `${employeeID}-${name}` })
        } catch (error) {
            notification.error({
                message: 'Error al descargar',
                description: 'No se pudo descargar el archivo'
            });
        }

    }


    return (
        <>
            <Row gutter={[16, 16]}>
                {
                    data?.map(file => (
                        <Col span={24} style={{ padding: 2 }} key={file.key}>
                            <Flex justify='space-between' align='center'>
                                <div>
                                    <Typography.Title style={{ margin: 0 }} level={5}>{file.name}</Typography.Title>
                                    <Typography.Text>{file.description}</Typography.Text>
                                </div>
                                <div>
                                    <Space>
                                        <Tooltip title={file.updated_at ? 'Actualizar' : 'Subir'}>
                                            {
                                                file.is_cropped
                                                    ?
                                                    <CropUpload fileEmployee={file} employeeID={employeeID} showGrid showReset showRotationSlider showZoomSlider />
                                                    :
                                                    <SimpleUpload file={file} employeeID={employeeID} />
                                            }
                                        </Tooltip>
                                        <Tooltip title='Descargar'>
                                            <Button onClick={() => handleDownloadFile(file)} disabled={!file.updated_at} size='small' variant='filled' color='green' icon={<DownloadOutlined />} />
                                        </Tooltip>
                                    </Space>
                                </div>
                            </Flex>
                        </Col>
                    ))
                }
            </Row>
        </>
    )
}
