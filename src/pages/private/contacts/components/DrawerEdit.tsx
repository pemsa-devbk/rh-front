import { Button, Drawer, Form, Input, Select, Space } from 'antd'
import { useUpdateContact } from '../../../../hooks/contact';
import { getUpdatedFields } from '../../../../helpers/getUpdateFields';
import { useEffect } from 'react';
import { Contact } from '../../../../api/interfaces/contact';

interface Props {
    open: boolean;
    onClose: () => void;
    contact?: Contact;
}
export const DrawerEdit = ({ onClose, open, contact }: Props) => {

    const [form] = Form.useForm();
    const { mutate: updateContact } = useUpdateContact(() => {
        onClose();
        form.resetFields();
    });

    const handleFormSubmit = (values: any) => {
        const changes = getUpdatedFields(contact!, values);
        updateContact({ contactID: contact!.contact_id, userID: contact!.user_id, data: changes });
    }
    useEffect(() => {
        form.setFieldsValue(contact);
    }, [contact])

    return (
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
    )
}
