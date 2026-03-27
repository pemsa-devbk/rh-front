import { useCreateEnterpise } from '../../../../hooks/enterprise'
import { Button, Drawer, Form, Space } from 'antd';
import { CreateEnterpriseDTO } from '../../../../api/interfaces/enterprise';
import TextArea from 'antd/es/input/TextArea';

interface Props {
    open: boolean;
    onClose: () => void;
}
export const DrawerCreate = ({ onClose, open }: Props) => {
    const { mutate } = useCreateEnterpise(() => {
        form.resetFields();
        onClose();
    });
    const [form] = Form.useForm<CreateEnterpriseDTO>();

    const handleFormSubmit = (values: CreateEnterpriseDTO) => {
        mutate(values)
    }
    return (
        <Drawer
            title="Crear empresa"
            open={open}
            onClose={onClose}
            extra={
                <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" onClick={() => form.submit()}>
                        Guardar
                    </Button>
                </Space>
            }
        >
            <Form
                layout='vertical'
                form={form}
                onFinish={handleFormSubmit}
            >
                <Form.Item
                    label="Nombre"
                    name="name"
                    rules={[{ required: true, message: "El nombre es requerido" }]}
                >
                    <TextArea autoSize />
                </Form.Item>
                <Form.Item
                    label="Dirección"
                    name="address"
                    rules={[{ required: true, message: "La dirección es requerida" }]}
                >
                    <TextArea autoSize />
                </Form.Item>
            </Form>
        </Drawer>
    )
}
