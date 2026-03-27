import { Button, message, Popconfirm, Skeleton, Space } from 'antd'
import { DownloadOutlined, StopTwoTone } from '@ant-design/icons';
import { useState } from 'react';
import { useCancelHoliday, useInfiniteHolidays } from '../../../../hooks/holiday';
import { Holiday, StatusHoliday } from '../../../../api/interfaces/holiday';
import { DrawerCreate } from './DrawerCreate';
import { DrawerList } from '../../../../components/DrawerList';
import { downloadFormatHoliday } from '../../../../api/holiday';
import { downloadFile } from '../../../../helpers/download';

interface Props {
    onClose: () => void;
    open: boolean;
    userID?: string;
}

export const DrawerListHolidays = ({ onClose, open, userID }: Props) => {
    const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteHolidays(userID || '', open && !!userID);
    const { mutate: cancelHoliday } = useCancelHoliday();
    const [openModal, setOpenModal] = useState({
        edit: false,
        create: false,
    });

    const handleDeleteContact = (id: number) => {
        cancelHoliday(id, {
            onSuccess() {
                message.success('Vacación cancelada eliminado');
            },
        })
    }
    const setStateOpenModal = (type: 'edit' | 'create') => {
        setOpenModal((old) => ({ ...old, [type]: !old[type] }));
    }
    const download = async({user_id, request_holiday_id}: Holiday) => {
        try {
            const { blob, headers } = await downloadFormatHoliday(user_id, request_holiday_id);
            downloadFile({ blob, headers })
        } catch (error) {
            // notification.error({
            //     message: 'Error al descargar',
            //     description: 'No se pudo descargar el archivo'
            // });
        }
    }

    return (
        <DrawerList<Holiday>
            loading={isFetching}
            title='Contactos'
            hasMore={hasNextPage}
            itemKey='request_holiday_id'
            loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
            nextFn={fetchNextPage}
            onClose={onClose}
            open={open}
            titleKey={(holiday) => holiday.others.text}
            descriptionKey={(holiday) => (holiday.status == StatusHoliday.pendiente)
                ? 'Pendiente'
                : (holiday.status == StatusHoliday.curso)
                    ? 'Curso'
                    : (holiday.status == StatusHoliday.finalizada)
                        ? 'Finalizada'
                        : 'Cancelada'}
            dataSource={data}
            extraButtons={
                <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type='primary' onClick={() => setStateOpenModal('create')}>Crear</Button>
                </Space>
            }
            renderActions={(holiday) => (
                <Space>
                    <Button onClick={() => download(holiday)} size='small' type='text' icon={<DownloadOutlined />}></Button>
                    {
                        (holiday.status != StatusHoliday.cancelado) &&
                        <Popconfirm
                            title="Cancelar"
                            description={`Cancelar vacaciones del ${holiday.others.text}`}
                            onConfirm={() => handleDeleteContact(holiday.request_holiday_id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button size='small' type='text' icon={<StopTwoTone twoToneColor='#f00' />}></Button>
                        </Popconfirm>
                    }
                </Space>
            )}
            children={
                <DrawerCreate onClose={() => setStateOpenModal('create')} open={openModal.create} userID={userID} />
            }
        />
    )
}
