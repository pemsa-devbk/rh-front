import { Button, Drawer, Form, Input, Space } from 'antd';
import { Employee } from '../../../../api/interfaces/employee';
import { getUpdatedFields } from '../../../../helpers/getUpdateFields';
import { useEffect } from 'react';
import { useEnterpriseInformationByEmployee, useUpdateEnterpriseInformation } from '../../../../hooks/enterpriseInformation';
import { UpdateEnterpriseInformationDTO } from '../../../../api/interfaces/enterpiseInformation';
interface Props {
    open: boolean;
    onClose: (key: string) => void;
    modalKey: string;
    employee: Employee;
}

export const DrawerEdit = ({ onClose, open, employee, modalKey }: Props) => {
    const { data } = useEnterpriseInformationByEmployee(employee.user_id);
    const [form] = Form.useForm<UpdateEnterpriseInformationDTO>();
    const phoneValue = Form.useWatch('phone', form);


    const { mutate: update } = useUpdateEnterpriseInformation(() => {
        onClose(modalKey);
    });

    const handleFormSubmit = (values: UpdateEnterpriseInformationDTO) => {
        const dataToUpdate = getUpdatedFields(data!, values);
        if (Object.keys(dataToUpdate).length === 0) return;
        update({ form: dataToUpdate, employeeID: employee.user_id });
    }

    useEffect(() => {
        if (data && open) form.setFieldsValue(data);
    }, [data, open])

    useEffect(() => {
        if (!phoneValue) form.setFieldValue('ext', undefined);
    }, [phoneValue])


    return (
        <Drawer
            title={`${employee?.name}`}
            open={open}
            onClose={() => onClose(modalKey)}
            extra={
                <Space>
                    <Button onClick={() => onClose(modalKey)}>Cancel</Button>
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
                    name='email'
                    label='Correo electronico'
                    rules={[{ type: 'email', message: 'Formato no valido para correo' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name='phone'
                    label='Telefono'
                    rules={[{ len: 10, message: 'El telefono consta de 10 digitos' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name='ext'
                    label='Extensión'
                    rules={[{ max: 6, message: 'La extensión consta de 5 digitos' }]}
                >
                    <Input disabled={!phoneValue} />
                </Form.Item>


                <Form.Item
                    name='cell_phone'
                    label='Celular'
                // rules={[{ len: 6, message: 'El telefono consta de 5 digitos' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Drawer>
    )
}
