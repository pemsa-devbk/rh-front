import { Button, Drawer, Form, Input, Select, Space } from 'antd'
import { MultipleContact } from '../../../../api/interfaces/contact';
import { useCreateContacts } from '../../../../hooks/contact';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

interface Props {
    onClose: () => void;
    open: boolean;
    id?: string;
}
export const DrawerCreate = ({ onClose, open, id }: Props) => {
    const [form] = Form.useForm<MultipleContact>();
    const { mutate: createContacts } = useCreateContacts(() => {
        form.resetFields();
        onClose();
    });
    const handleFormSubmit = (values: MultipleContact) => {
        createContacts({ userID: id!, data: values });
    }

    return (
        <Drawer
            title="Crear contactos"
            size='large'
            onClose={onClose}
            open={open}
            extra={
                <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type='primary' onClick={() => form.submit()}>Guardar</Button>
                </Space>
            }
        >
            <Form form={form} onFinish={handleFormSubmit}>
                <Form.List name="contacts">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'contact']}
                                        rules={[{ required: true, message: 'El contacto es obligatorio' }]}
                                    >
                                        <Input placeholder="Contacto" />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'type']}
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
                                        {...restField}
                                        name={[name, 'notes']}
                                    >
                                        <Input placeholder="Notas" />
                                    </Form.Item>

                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                </Space>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Agregar otro contacto
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form>

        </Drawer>
    )
}
