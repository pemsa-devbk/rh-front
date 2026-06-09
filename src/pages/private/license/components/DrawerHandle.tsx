import { Button, DatePicker, Drawer, Form, Radio, Space } from 'antd';
import { Employee } from '../../../../api/interfaces/employee';
import { getUpdatedFields } from '../../../../helpers/getUpdateFields';
import { useEffect } from 'react';
import dayjs from '../../../../helpers/dayjs'
import { CreateLicenseDTO } from '../../../../api/interfaces/license';
import { useCreateLicense, useLicenseByEmployee, useUpdateLicense } from '../../../../hooks/license';
interface Props {
    open: boolean;
    onClose: (key: string) => void;
    modalKey: string;
    employee: Employee;
}

export const DrawerHandle = ({ onClose, open, employee, modalKey }: Props) => {
    const { data } = useLicenseByEmployee(employee.user_id);
    const [form] = Form.useForm<CreateLicenseDTO>();


    const { mutate: update } = useUpdateLicense(() => {
        onClose(modalKey);
    });
    const { mutate: create } = useCreateLicense(() => {
        onClose(modalKey);
    });
    const handleFormSubmit = (values: CreateLicenseDTO) => {
        if (data) {
            const dataToUpdate = getUpdatedFields(data!, values);
            if (Object.keys(dataToUpdate).length === 0) return;
            update({ form: dataToUpdate, employeeID: employee.user_id });
        } else {
            create({ form: values, employeeID: employee.user_id });
        }
    }

    useEffect(() => {
        if (data && open) form.setFieldsValue(data);
    }, [data, open])


    return (
        <Drawer
            title={`${employee?.name}`}
            open={open}
            onClose={() =>onClose(modalKey)}
            extra={
                <Space>
                    <Button onClick={() =>onClose(modalKey)}>Cancel</Button>
                    <Button type="primary" onClick={() => form.submit()}>
                        {data ? 'Actualizar' : 'Guardar'}
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
                    name='type'
                    label='Tipo de licencia'
                    rules={[{ required: true, message: 'El tipo de licensia es obligatorio' }]}
                >
                    <Radio.Group block buttonStyle='outline' optionType='button'>
                        <Radio value={2}>Particular</Radio>
                        <Radio value={1}>Mercantil</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    name='issue_date'
                    label='Fecha de emision'
                    rules={[{ required: true, message: 'La fecha de emision es obligatoria' }]}
                    getValueProps={(value) => ({
                        value: value ? dayjs(value) : null
                    })}
                    normalize={(value) => value ? value.format('YYYY-MM-DD') : null}
                >
                    <DatePicker style={{ width: '100%' }} format={'YYYY-MM-DD'} />
                </Form.Item>
                <Form.Item
                    name='validity'
                    label='Fecha de vencimiento'
                    rules={[{ required: true, message: 'La fecha de vencimiento es obligatoria' }]}
                    getValueProps={(value) => ({
                        value: value ? dayjs(value) : null
                    })}
                    normalize={(value) => value ? value.format('YYYY-MM-DD') : null}
                >
                    <DatePicker style={{ width: '100%' }} format={'YYYY-MM-DD'} />
                </Form.Item>
            </Form>
        </Drawer>
    )
}
