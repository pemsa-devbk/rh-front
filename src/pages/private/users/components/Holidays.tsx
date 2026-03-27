import InfiniteScroll from 'react-infinite-scroll-component'
import { useDeleteContact } from '../../../../hooks/contact';
import { Button, Divider, List, message, Popconfirm, Skeleton, Space } from 'antd';
import { CloseCircleTwoTone, FilePdfTwoTone } from '@ant-design/icons';
import { useState } from 'react';
import { useHolidays } from '../../../../hooks/holiday';
import { StatusHoliday } from '../../../../api/interfaces/holiday';


interface Props {
    id: string;
}

export const Holidays = ({ id }: Props) => {
    const { data, fetchNextPage: fNextPage, hasNextPage: hNextPage, refetch } = useHolidays(id);
    const [open, setOpen] = useState(false);
    const { mutate: deleteContact } = useDeleteContact();

    const onClose = () => {
        setOpen(false);
    }


    const handleDeleteContact = (id: number) => {
        deleteContact(id, {
            onSuccess() {
                message.success('Contacto eliminado');
                refetch();
            },
        })
    }

    return (
        <>
            <InfiniteScroll
                dataLength={data?.pages.flatMap(p => p.holidays).length || 0}
                next={fNextPage}
                hasMore={hNextPage}
                loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                endMessage={<Divider plain>No hay mas datos</Divider>}
                scrollableTarget="scrollableDiv"
            >
                <List
                    dataSource={data?.pages.flatMap(p => p.holidays)}
                    renderItem={(item) => (
                        <List.Item key={item.id}>
                            <List.Item.Meta
                                title={item.others.text}
                                description={
                                    item.status === StatusHoliday.pendiente
                                        ? 'Pendiente'
                                        : item.status === StatusHoliday.curso
                                            ? 'En curso'
                                            : item.status === StatusHoliday.finalizada
                                                ? 'Finalizada'
                                                : 'Cancelada'
                                }
                            />
                            {/* {(item.type == TypeContact.CORREO) ? 'Correo' : 'Telefono'} */}
                            <Space>
                                <Button size='small' type='text' icon={<FilePdfTwoTone twoToneColor='#0fa' />}></Button>
                                {
                                    item.status !== StatusHoliday.cancelado
                                    &&
                                    <Popconfirm
                                        title="Cancelar"
                                        description={`Cancelar la vacación ${item.others.text}`}
                                        // onConfirm={() => handleDeleteContact(item.id)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button size='small' type='text' icon={<CloseCircleTwoTone twoToneColor='#f00' />}></Button>
                                    </Popconfirm>
                                }
                            </Space>
                        </List.Item>
                    )}
                />
            </InfiniteScroll>
        </>
    )
}
