import { Button, message, Popconfirm, Space, TableProps, Tooltip, Upload } from "antd";
import { Holiday, StatusHoliday } from "../../../api/interfaces/holiday";
import { DownloadOutlined, StopTwoTone, UploadOutlined } from "@ant-design/icons";
import { downloadFormatHoliday, uploadVoucher } from "../../../api/holiday";
import { useCancelHoliday } from "../../../hooks/holiday";
import { downloadFile } from "../../../helpers/download";
interface Props {
    id?: string;
    refetch: () => void;
}
export const GetColumns = ({ id, refetch }: Props): TableProps<Holiday>['columns'] => {
    const { mutate: cancelHoliday } = useCancelHoliday();

    const download = async({user_id, request_holiday_id}: Holiday) => {
        try {
            const { blob, headers } = await downloadFormatHoliday(user_id, request_holiday_id);
            downloadFile({ blob, headers})
        } catch (error) {
            // notification.error({
            //     message: 'Error al descargar',
            //     description: 'No se pudo descargar el archivo'
            // });
        }
    }

    const handleDeleteContact = (id: number) => {
        cancelHoliday(id, {
            onSuccess() {
                message.success('Vacación cancelada eliminado');
                refetch();
            },
        })
    }

    const handleCustomRequest = async (options: any, record: Holiday) => {
        const { file, onSuccess, onError } = options;
        const formData = new FormData();
        formData.append('document', file);

        try {
            await uploadVoucher({id: record.request_holiday_id, formData});
            message.success('Archivo subido correctamente');
            onSuccess(formData);
            refetch();
        } catch (err) {
            console.error(err);
            message.error('Error al subir archivo');
            onError(err);
        }
    };

    return [
        {
            title: 'Descripción',
            dataIndex: 'others',
            render(value) {
                return <>{value.text}</>
            }
        },
        {
            title: 'Fecha de regreso',
            dataIndex: 'others',
            render(value) {
                return <>{value.nextDate}</>
            }
        },
        {
            title: 'Días',
            dataIndex: 'days',
            render(value) {
                return <>{value.length}</>
            }
        },
        {
            title: 'Estatus',
            dataIndex: 'status',
            render(_, record) {
                return <>{
                    (record.status === StatusHoliday.curso)
                        ? 'En curso'
                        : (record.status === StatusHoliday.pendiente)
                            ? 'Pendiente'
                            : (record.status === StatusHoliday.finalizada)
                                ? 'Finalizada'
                                : 'Cancelada'
                }</>
            }
        },
        {
            title: 'Acciones',
            render(_, record) {
                return <Space wrap>
                    {
                        record.status !== StatusHoliday.cancelado &&
                        <Popconfirm
                            title="Cancelar"
                            description={`Cancelar vacaciones del ${record.others.text}`}
                            onConfirm={() => handleDeleteContact(record.request_holiday_id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button size='small' type='text' icon={<StopTwoTone twoToneColor='#f00' />}></Button>
                        </Popconfirm>
                    }
                    <Tooltip title="Subir formato firmado" >
                        <Upload
                            showUploadList={false}
                            name='file'
                            maxCount={1}
                            customRequest={(options) => handleCustomRequest(options, record)}
                            beforeUpload={(file) => {
                                const isCorrectFormat = file.type === 'application/pdf';
                                if (!isCorrectFormat) {
                                    message.error(`${file.name} no es un formato soportado`);
                                }
                                return isCorrectFormat || Upload.LIST_IGNORE;
                            }}
                        >
                            <Button size='small' type='text' icon={<UploadOutlined />}></Button>
                        </Upload>
                    </Tooltip>
                    <Button onClick={() => download(record)} size='small' type='text' icon={<DownloadOutlined />}></Button>
                </Space>
            }
        }
    ];
}