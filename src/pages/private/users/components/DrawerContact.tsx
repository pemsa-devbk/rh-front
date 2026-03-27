import { Button, Drawer, Form, Input, message, Select, Space } from 'antd'
import { useCreateContacts } from '../../../../hooks/contact';
import { MultipleContact } from '../../../../api/interfaces/contact';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
interface Props {
    onClose: () => void;
    open: boolean;
    refetch?: () => void;
    id: string;
}
export const DrawerContact = ({ onClose, open, refetch, id }: Props) => {
    const [form] = Form.useForm<MultipleContact>();
    const { mutate: createContacts } = useCreateContacts();


    const handleFormSubmit = (values: MultipleContact) => {
        createContacts({ id: id, data: values }, {
            onSuccess(data, variables, context) {
                message.success('Contactos añadidos de manera correcta');
                form.resetFields();
                onClose();
                refetch && refetch();
            },
        })
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
