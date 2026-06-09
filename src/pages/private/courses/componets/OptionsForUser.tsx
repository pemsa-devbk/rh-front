import { Button, Popconfirm, Space, Tooltip, Upload } from 'antd'
import { DeleteOutlined, DownloadOutlined, QuestionCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Employee } from '../../../../api/interfaces/employee';

interface Props {
    user: Employee;
    onDelete: () => void;
    isDeleting: boolean;
    isUpload: boolean;
    handleCustomRequest: (options: any) => void;
    handleDownload: () => void;
}
export const OptionsForUser = ({ user, onDelete, isDeleting, handleCustomRequest, isUpload, handleDownload }: Props) => {

    return (
        <Space>
            {
                user.have_proof&&
                    <Tooltip title="Descargar comprobante">
                        <Button onClick={handleDownload} size='small' variant='filled' color='blue' icon={<DownloadOutlined />}></Button>
                    </Tooltip>
            }
            <Tooltip title="Subir comprobate" placement='left' >
                <Upload
                    showUploadList={false}
                    name='file'
                    maxCount={1}
                    customRequest={(options) => handleCustomRequest(options)}
                >
                    <Button loading={isUpload} disabled={isUpload} size='small' variant='filled' color='blue' icon={<UploadOutlined />} />
                </Upload>
            </Tooltip>

            <Popconfirm
                title={user.name}
                description={`Eliminar al usuario`}
                onConfirm={() => onDelete()}
                okText="Eliminar"
                cancelText="Cancelar"
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            >
                <Button loading={isDeleting} size='small' variant='filled' color='red' icon={<DeleteOutlined />}></Button>
            </Popconfirm>
        </Space>
    )
}
