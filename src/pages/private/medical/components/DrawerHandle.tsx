import { CreateMedicalDTO } from '../../../../api/interfaces/medical';
import { Button, Drawer, Form, Input, Select, Space } from 'antd';
import { Employee } from '../../../../api/interfaces/employee';
import { getUpdatedFields } from '../../../../helpers/getUpdateFields';
import { useCreateMedical, useMedicalByEmployee, useUpdateMedical } from '../../../../hooks/medical';
import { useEffect } from 'react';

interface Props {
    open: boolean;
    onClose: (key: string) => void;
    modalKey: string;
    employee: Employee;
}

export const DrawerHandle = ({ onClose, open, employee,modalKey }: Props) => {
    const { data } = useMedicalByEmployee(employee.user_id);
    const [form] = Form.useForm<CreateMedicalDTO>();
    const { mutate: update } = useUpdateMedical(() => {
        onClose(modalKey);
    });
    const { mutate: create } = useCreateMedical(() => {
        onClose(modalKey);
    });
    const handleFormSubmit = (values: CreateMedicalDTO) => {
        if(data){
            const dataToUpdate = getUpdatedFields(data!, values);
            if (Object.keys(dataToUpdate).length === 0) return;
            update({ form: dataToUpdate, employeeID: employee.user_id });
        }else{
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
                    name='blood_type'
                    label='Tipo de sangre'
                >
                    <Select
                        options={[
                            { label: 'A+', value: 'A+' },
                            { label: 'A-', value: 'A-' },
                            { label: 'B+', value: 'B+' },
                            { label: 'B-', value: 'B-' },
                            { label: 'AB+', value: 'AB+' },
                            { label: 'AB-', value: 'AB-' },
                            { label: 'O+', value: 'O+' },
                            { label: 'O-', value: 'O-' },
                        ]}
                    />
                </Form.Item>
                <Form.Item
                    name='allergies'
                    label='Alergias'
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name='nss'
                    label='Número de seguro social'
                    rules={[{ len: 11, message: 'El número de seguro social debe contener 11 caracteres.' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name='diseases'
                    label='Enfermedades'
                >
                    <Input />
                </Form.Item>
            </Form>
        </Drawer>
    )
}
