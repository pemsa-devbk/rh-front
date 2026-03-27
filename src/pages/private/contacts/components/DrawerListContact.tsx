import { Button, Popconfirm, Skeleton, Space } from 'antd'
import { useState } from 'react';
import { DrawerCreate } from './DrawerCreate';
import { Contact } from '../../../../api/interfaces/contact';
import { DrawerEdit } from './DrawerEdit';
import { DrawerList } from '../../../../components/DrawerList';
import { useContact, useDeleteContact } from '../../../../hooks/contact';
import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';

interface Props {
    onClose: () => void;
    open: boolean;
    userID?: string;
}

export const DrawerListContact = ({ onClose, open, userID }: Props) => {
    const [openModal, setOpenModal] = useState({
        edit: false,
        create: false,
    });
    const { data, fetchNextPage, hasNextPage, isFetching } = useContact(userID || '', open && !!userID);
    const [selectedContact, setSelectedContact] = useState<Contact>();
    const { mutate: deleteContact } = useDeleteContact();

    const setStateOpenModal = (type: 'edit' | 'create') => {
        setOpenModal((old) => ({ ...old, [type]: !old[type] }));
    }
    const openEditModal = (contact: Contact) => {
        setSelectedContact(contact);
        setStateOpenModal('edit');
    }
    return (
        <DrawerList<Contact>
            loading={isFetching}
            title='Contactos'
            hasMore={hasNextPage}
            itemKey='contact_id'
            loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
            nextFn={fetchNextPage}
            onClose={onClose}
            open={open}
            titleKey='contact'
            descriptionKey={(contact) => contact.notes || ''}
            dataSource={data}
            extraButtons={
                <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type='primary' onClick={() => setStateOpenModal('create')}>Crear</Button>
                </Space>
            }
            renderActions={(contact) => (
                <Space>
                    <Button onClick={() => openEditModal(contact)} size='small' type='text' icon={<EditTwoTone twoToneColor='#fa0' />}></Button>
                    <Popconfirm
                        title="Eliminar contacto"
                        description={`Eliminar el contacto ${contact.contact}`}
                        onConfirm={() => deleteContact({contactID: contact.contact_id, userID: contact.user_id})}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button size='small' type='text' icon={<DeleteTwoTone twoToneColor='#f00' />}></Button>
                    </Popconfirm>
                </Space>
            )}
            children={
                <>
                    <DrawerEdit open={openModal.edit} onClose={() => setStateOpenModal('edit')} contact={selectedContact} />
                    <DrawerCreate open={openModal.create} onClose={() => setStateOpenModal('create')} id={userID} />
                </>
            }
        />
    )
}
