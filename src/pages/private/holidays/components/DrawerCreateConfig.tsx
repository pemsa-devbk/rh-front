import { useCreateConfig } from '../../../../hooks/holiday';
import { Button, Drawer, Form, InputNumber, Space } from 'antd';
import { HolidayConfigForm } from '../../../../api/interfaces/holiday';

interface Props{
    open: boolean;
    closeModal: () => void;
}
export const DrawerCreateConfig = ({closeModal, open}: Props) => {
    const [form] = Form.useForm<HolidayConfigForm>();
    const { mutate: createConfig } = useCreateConfig(() => {
        form.resetFields();
    });

    const handleFormCreateSubmit = (values: HolidayConfigForm) => {
        createConfig(values)
    }

    return (
        <Drawer
            title="Crear configuración"
            open={open}
            onClose={closeModal}
            extra={
                <Space>
                    <Button onClick={closeModal}>Cancel</Button>
                    <Button type="primary" onClick={() => form.submit()}>
                        Guardar
                    </Button>
                </Space>
            }
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={handleFormCreateSubmit}
            >
                <Form.Item
                    label="Años minimos"
                    name="min_year"
                    rules={[{ required: true, message: "Campo requerido" }]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label="Años maximos"
                    name="max_year"
                    rules={[{ required: true, message: "Campo requerido" }]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label="Número de días"
                    name="number_days"
                    rules={[{ required: true, message: "Campo requerido" }]}
                >
                    <InputNumber />
                </Form.Item>

            </Form>
        </Drawer>
    )
}
