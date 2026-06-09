import { Button, Drawer, Form, InputNumber, Space } from 'antd'
import { useEffect } from 'react'
import { HolidayConfig, HolidayConfigForm } from '../../../../api/interfaces/holiday';
import { useUpdateConfig } from '../../../../hooks/holiday';

interface Props {
    open: boolean;
    closeModal: () => void;
    config?: HolidayConfig;
}
export const DrawerUpdateConfig = ({ open, closeModal, config }: Props) => {
    const [form] = Form.useForm<HolidayConfigForm>();
    const { mutate } = useUpdateConfig(() => {
        form.resetFields();
        closeModal();
    });
    const handleFormSubmit = (values: Partial<HolidayConfigForm>) => {
        mutate({ id: config!.holiday_config_id, dataSend: values })
    }

    useEffect(() => {
        if(config) form.setFieldsValue(config);
    }, [config])

    return (
        <Drawer
            title="Actualizar configuración"
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
                onFinish={handleFormSubmit}
            >
                <Form.Item
                    label="Años minimos"
                    name="min_year"
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label="Años maximos"
                    name="max_year"
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label="Número de días"
                    name="number_days"
                >
                    <InputNumber />
                </Form.Item>

            </Form>
        </Drawer>
    )
}
