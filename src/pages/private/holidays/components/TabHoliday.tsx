import { useMemo } from 'react'
import { useCancelHoliday, useInfiniteHolidaysByEmployee, useUploadProof } from '../../../../hooks/holiday';
import { DrawerCreate } from './DrawerCreate';
import { useModals } from '../../../../hooks/useModals';
import { Badge, Button, Divider, Flex, List, notification, Popconfirm, Space, Tooltip, Typography, Upload } from 'antd';
import { DownloadOutlined, PlusOutlined, QuestionCircleOutlined, StopOutlined, UploadOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import dayjs from '../../../../helpers/dayjs'
import { Holiday, StatusHoliday } from '../../../../api/interfaces/holiday';
import { downloadProofHoliday } from '../../../../api/holiday';
import { downloadFile } from '../../../../helpers/download';

interface Props {
    employeeID: string;
}
const MODAL_KEYS = ['create', 'edit'];
type ModalKeys = typeof MODAL_KEYS[number];

export const TabHoliday = ({ employeeID }: Props) => {
    const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteHolidaysByEmployee(employeeID);
    const { mutate: cancelHoliday } = useCancelHoliday();
    const { openModal, closeModal, isOpen } = useModals<ModalKeys>(MODAL_KEYS);
    const { mutate: uploadProof, isPending } = useUploadProof();


    const handleCustomRequest = (options: any, holiday: Holiday) => {
        const { file } = options;
        const formData = new FormData();
        formData.append('proof', file);
        uploadProof({ holidayID: holiday.request_holiday_id, employeeID: employeeID, formData })
    }

    const handleDownloadProof = async ({ request_holiday_id, others }: Holiday) => {
        try {
            const { blob, headers } = await downloadProofHoliday({ holidayID: request_holiday_id, employeeID: employeeID });
            downloadFile({ blob, headers, customFileName: `${employeeID}-${others.text}` })
        } catch (error) {
            notification.error({
                message: 'Error al descargar',
                description: 'No se pudo descargar el archivo'
            });
        }

    }
    const holidays = useMemo(() =>
        data?.pages.flatMap(p => p.data) ?? [],
        [data?.pages]
    );

    return (
        <>
            <DrawerCreate open={isOpen('create')} onClose={closeModal} employeeID={employeeID} modalKey='create' />

            <Button onClick={() => openModal('create')} type='primary' style={{ marginRight: 0, marginLeft: 'auto', display: 'block', marginBottom: 10 }} icon={<PlusOutlined />} >Crear vacación</Button>

            <InfiniteScroll
                dataLength={holidays.length}
                next={fetchNextPage}
                hasMore={hasNextPage}
                loader={isFetching}
                endMessage={<Divider>No hay mas datos</Divider>}
                scrollableTarget="scrollableDiv"
            >
                <List
                    dataSource={holidays}
                    size='small'
                    renderItem={(holiday) => (
                        <List.Item
                            key={`holiday_${holiday.request_holiday_id}`}
                            actions={[
                                <Tooltip title={holiday.have_format ? 'Descargar comprobante' : 'Descargar formato'}>
                                    <Button onClick={() => handleDownloadProof(holiday)} size='small' variant='filled' color='blue' icon={<DownloadOutlined />} />
                                </Tooltip>,
                                <Tooltip title={holiday.have_format ? 'Actualizar comprobante' : 'Subir comprobante'}>
                                    <Upload
                                        showUploadList={false}
                                        name='file'
                                        maxCount={1}
                                        customRequest={(options) => handleCustomRequest(options, holiday)}
                                    >
                                        <Button loading={isPending} disabled={isPending} size='small' variant='filled' color='blue' icon={<UploadOutlined />} />
                                    </Upload>
                                </Tooltip>,
                                <Popconfirm
                                    title='¿Cancelar vacaciones?'
                                    onConfirm={() => cancelHoliday({ employeeID, holidayID: holiday.request_holiday_id })}
                                    okText="Si"
                                    cancelText="No"
                                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                >
                                    <Button disabled={holiday.status === StatusHoliday.CANCELADA} size='small' variant='filled' color='red' icon={<StopOutlined />}></Button>
                                </Popconfirm>
                            ]}
                        >
                            <List.Item.Meta
                                title={
                                    <Flex justify='space-between'>
                                        {holiday.others.text}
                                        {
                                            (holiday.status == StatusHoliday.SOLICITUD)
                                                ? <Badge color='blue' text='En solicitud' />
                                                : (holiday.status == StatusHoliday.APROBADA)
                                                    ? <Badge color='lime' text='Aprobada' />
                                                    : (holiday.status == StatusHoliday.RECHAZADA)
                                                        ? <Badge color='volcano' text='Rechazada' />
                                                        : (holiday.status == StatusHoliday.FINALIZADA)
                                                            ? <Badge color='green' text='Finalizada' />
                                                            : <Badge color='red' text='Cancelada' />
                                        }
                                    </Flex>
                                }
                                description={
                                    <Flex>

                                        <Space>
                                            <Typography.Text>Fecha de creación: </Typography.Text>
                                            <Typography.Text type='secondary'>{dayjs(holiday.created_at).format('YYYY-MM-DD')}</Typography.Text>
                                            <Divider type='vertical' />
                                            {
                                                holiday.comment &&
                                                <>
                                                    <Typography.Text type='secondary'>Comentario:</Typography.Text>
                                                    <Typography.Text> {holiday.comment}</Typography.Text>
                                                </>
                                            }
                                        </Space>
                                    </Flex>
                                }

                            />
                        </List.Item>
                    )}
                >

                </List>
            </InfiniteScroll>
        </>
    )
}
