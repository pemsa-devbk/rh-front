import { FormHoliday } from '../../../../api/interfaces/holiday';
import { Button, DatePicker, Drawer, Form, Input, message, Space } from 'antd';
import { useCreateHoliday } from '../../../../hooks/holiday';
import dayjs from 'dayjs';
interface Props {
    onClose: () => void;
    open: boolean;
    userID?: string;
}
export const DrawerCreate = ({ onClose, open, userID }: Props) => {
    const [form] = Form.useForm<FormHoliday>();
    const {mutate} = useCreateHoliday();

    const handleFormSubmit = (values: FormHoliday) => {
        values.days = values.days.map(day => dayjs(day).format('YYYY-MM-DD'));
        mutate({ userID: userID!, data: values }, {
            onSuccess() {
                message.success('Solicitud creada');
                form.resetFields();
                onClose();
            },
        })
    }
    return (
        <Drawer
            title="Solicictud de vacaciones"
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
                    name='days'
                    label="Días"
                >
                    <DatePicker multiple maxTagCount="responsive"  />
                </Form.Item>
                <Form.Item
                    name='comment'
                    label='Comentario'
                >
                    <Input placeholder="Comentario" />
                </Form.Item>
            </Form>

        </Drawer>
    )
}
