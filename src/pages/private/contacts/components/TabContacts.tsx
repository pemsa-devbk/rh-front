import { useContactsByEmployee, useDeleteContact } from '../../../../hooks/contact';
import { Alert, Button, Divider, List, Popconfirm, Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Contact, TypeContact } from '../../../../api/interfaces/contact';
import { DrawerEdit } from './DrawerEdit';
import { useMemo, useState } from 'react';
import { DrawerCreate } from './DrawerCreate';
import { useModals } from '../../../../hooks/useModals';

interface Props {
    employeeID: string;
}

const MODAL_KEYS = ['create', 'edit'];
type ModalKeys = typeof MODAL_KEYS[number];

export const TabContacts = ({ employeeID }: Props) => {
    const { data, isError, isFetching, error, hasNextPage, fetchNextPage } = useContactsByEmployee(employeeID);
    const { mutate: deleteContact } = useDeleteContact();
    const [selectedContact, setSelectedContact] = useState<Contact>();
    
    const { openModal, closeModal, isOpen } = useModals<ModalKeys>(MODAL_KEYS);

    const handleEditContact = (contact: Contact) => {
        setSelectedContact(contact);
        openModal('edit');
    }
    const handleDeleteContact = (contact: Contact) => {
        deleteContact({ contactID: contact.contact_id, employeeID: employeeID })
    }
    const contacts = useMemo(() =>
        data?.pages.flatMap(p => p.data) ?? [],
        [data?.pages]
    );

    if (isFetching)
        return <Skeleton loading={isFetching} />;
    if (isError)
        return <Alert type='error' message={`Error al obtener los contactos ${error.message}`} />

    return (
        <>
            <DrawerCreate open={isOpen('create')} onClose={closeModal} employeeID={employeeID} modalKey='create' />

            <DrawerEdit open={isOpen('edit')} onClose={() => closeModal('edit')} contact={selectedContact} />
            
            <Button onClick={() => openModal('create')} type='primary' style={{ marginRight: 0, marginLeft: 'auto', display: 'block', marginBottom: 10 }} icon={<PlusOutlined />} >Añadir contacto</Button>

            <InfiniteScroll
                dataLength={contacts.length}
                next={fetchNextPage}
                hasMore={hasNextPage}
                loader={isFetching}
                endMessage={<Divider>No hay mas contactos</Divider>}
                scrollableTarget="scrollableDiv"
            >
                <List
                    dataSource={contacts}
                    renderItem={(contact) => (
                        <List.Item
                            key={'contact_' + contact.contact_id}
                            actions={[
                                <Button type='text' onClick={() => handleEditContact(contact)} icon={<EditOutlined />} />,
                                <Popconfirm
                                    title="Eliminar"
                                    description={`Eliminar el contacto ${contact.contact}`}
                                    onConfirm={() => handleDeleteContact(contact)}
                                    okText="Yes"
                                    cancelText="No"
                                >

                                    <Button type='text' icon={<DeleteOutlined />} />
                                </Popconfirm>
                            ]}
                        >
                            <List.Item.Meta
                                title={contact.contact}
                                description={contact.notes}
                                avatar={contact.type === TypeContact.CORREO ? 'Correo' : 'Telefono'}
                            />
                        </List.Item>
                    )}
                >

                </List>
            </InfiniteScroll>
        </>
    )
}
