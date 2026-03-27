import InfiniteScroll from 'react-infinite-scroll-component'
import { useContact, useDeleteContact, useUpdateContact } from '../../../../hooks/contact';
import { Button, Divider, Drawer, Form, Input, List, message, Popconfirm, Select, Skeleton, Space } from 'antd';
import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';
import { useState } from 'react';
import { Contact } from '../../../../api/interfaces/users';
import { getUpdatedFields } from '../../../../helpers/getUpdateFields';

interface Props {
    id: string;
}

export const Contacts = ({ id }: Props) => {
    const { data: contactData, fetchNextPage: fNextPage, hasNextPage: hNextPage, refetch } = useContact(id);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [contact, setContact] = useState<Contact>();
    const { mutate: deleteContact } = useDeleteContact();
    const { mutate: updateContact } = useUpdateContact();

    const onClose = () => {
        setOpen(false);
    }

    const openDrawer = (contact: Contact) => {
        form.setFieldsValue(contact);
        setContact(contact);
        setOpen(true);
    }

    const handleDeleteContact = (id: number) => {
        deleteContact(id, {
            onSuccess() {
                message.success('Contacto eliminado');
                refetch();
            },
        })
    }

    const handleFormSubmit = (values: any) => {
        const changes = getUpdatedFields(contact!, values);
        updateContact({ id: contact!.id, data: changes }, {
            onSuccess() {
                refetch();
                onClose();
                form.resetFields();
            },
        })

    }

    return (
        <>
            <Drawer
                title="Editar contacto"
                size='default'
                onClose={onClose}
                open={open}
                extra={
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type='primary' onClick={() => form.submit()}>Guardar</Button>
                    </Space>
                }
            >
                <Form form={form} onFinish={handleFormSubmit} layout='vertical'>
                    <Form.Item
                        name='contact'
                        label='Valor del contacto'
                        rules={[{ required: true, message: 'El contacto es obligatorio' }]}
                    >
                        <Input placeholder="Contacto" />
                    </Form.Item>

                    <Form.Item
                        name='type'
                        label="Tipo de contacto"
                        rules={[{ required: true, message: 'El tipo de contacto es obligatorio' }]}
                    >
                        <Select
                            placeholder="Seleccione el tipo de contacto"
                            options={[
                                { label: "Correo", value: 1 },
                                { label: "Telefono", value: 2 },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Notas"
                        name='notes'
                    >
                        <Input placeholder="Notas" />
                    </Form.Item>


                </Form>
            </Drawer>

            <InfiniteScroll
                dataLength={contactData?.pages.flatMap(p => p.contacts).length || 0}
                next={fNextPage}
                hasMore={hNextPage}
                loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                endMessage={<Divider plain>No hay mas datos</Divider>}
                scrollableTarget="scrollableDiv"
            >
                <List
                    dataSource={contactData?.pages.flatMap(p => p.contacts)}
                    renderItem={(item) => (
                        <List.Item key={item.id}>
                            <List.Item.Meta
                                title={item.contact}
                                description={item.notes}
                            />
                            {/* {(item.type == TypeContact.CORREO) ? 'Correo' : 'Telefono'} */}
                            <Space>
                                <Button onClick={() => openDrawer(item)} size='small' type='text' icon={<EditTwoTone twoToneColor='#fa0' />}></Button>
                                <Popconfirm
                                    title="Eliminar contacto"
                                    description={`Eliminar el contacto ${item.contact}`}
                                    onConfirm={() => handleDeleteContact(item.id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button size='small' type='text' icon={<DeleteTwoTone twoToneColor='#f00' />}></Button>
                                </Popconfirm>
                            </Space>
                        </List.Item>
                    )}
                />
            </InfiniteScroll>
        </>
    )
}
