import { FormHoliday } from '../../../../api/interfaces/holiday';
import { Button, DatePicker, Drawer, Form, Input, message, Space } from 'antd';
import { useCreateHoliday } from '../../../../hooks/holiday';
import dayjs from '../../../../helpers/dayjs';
interface Props {
    onClose: (key: string) => void;
    open: boolean;
    modalKey: string;
    employeeID: string;
}
export const DrawerCreate = ({ onClose, open, employeeID, modalKey }: Props) => {
    const [form] = Form.useForm<FormHoliday>();
    const { mutate } = useCreateHoliday();

    const handleFormSubmit = (values: FormHoliday) => {
        mutate({ employeeID: employeeID!, form: values }, {
            onSuccess() {
                message.success('Solicitud creada');
                form.resetFields();
                onClose(modalKey);
            },
        })
    }
    const handleCloseModal = () => {
        onClose(modalKey)
    }
    return (
        <Drawer
            title="Solicictud de vacaciones"
            onClose={handleCloseModal}
            open={open}
            extra={
                <Space>
                    <Button onClick={handleCloseModal}>Cancel</Button>
                    <Button type='primary' onClick={() => form.submit()}>Guardar</Button>
                </Space>
            }
        >
            <Form form={form} onFinish={handleFormSubmit} layout='vertical'>
                <Form.Item
                    name='days'
                    label="Días"
                    getValueProps={(value) => {
                        //@ts-ignore
                        return value?.map(date => dayjs(date)) || null;
                    }}
                    //@ts-ignore
                    normalize={(value) => value ? value.map( date => date.format('YYYY-MM-DD')) : null}
                >
                    <DatePicker multiple maxTagCount="responsive" />
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
