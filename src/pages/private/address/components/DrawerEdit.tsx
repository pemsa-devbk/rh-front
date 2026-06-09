import { CreateMedicalDTO } from '../../../../api/interfaces/medical';
import { Button, Drawer, Form, Input, Select, Space } from 'antd';
import { Employee } from '../../../../api/interfaces/employee';
import { getUpdatedFields } from '../../../../helpers/getUpdateFields';
import { useEffect } from 'react';
import { useAddressByEmployee, useUpdateAddress } from '../../../../hooks/address';
import { AddressForm } from '../../../../api/interfaces/address';
import { useColoniesByPostal } from '../../../../hooks/mx';

interface Props {
    open: boolean;
    onClose: (key: string) => void;
    modalKey: string;
    employee: Employee;
}

export const DrawerEdit = ({ onClose, open, employee, modalKey }: Props) => {
    const { data } = useAddressByEmployee(employee.user_id);

    const [form] = Form.useForm<AddressForm>();
    const postalValue = Form.useWatch('postal_code', form);
    const { data: dataColonies, isFetching, isSuccess } = useColoniesByPostal(postalValue || '');


    const { mutate: update } = useUpdateAddress(() => {
        onClose(modalKey);
    });

    const handleFormSubmit = (values: AddressForm) => {
        const format = {
            colony_id: values.colony.value,
            street: values.street, 
            references: values.references,
        }
        const dataToUpdate = getUpdatedFields(data!, format);

        if (Object.keys(dataToUpdate).length === 0) return;
        update({ form: dataToUpdate, employeeID: employee.user_id });
    }

    useEffect(() => {
        const colony = (data?.colony_name && data?.colony_id) ? { label: data.colony_name, value: data.colony_id } : undefined;
        if (data && open) form.setFieldsValue({ ...data, municipality: data.municipality_name, colony, state: data.state_name });
    }, [data, open])

    useEffect(() => {
        if (postalValue?.length === 5 && isSuccess && data) {
            form.setFieldsValue({
                state: data.state_name,
                municipality: data.municipality_name,
            });
        }

        if (postalValue?.length < 5) {
            form.setFieldsValue({
                state: '',
                municipality: '',
                colony: undefined,
            });
        }
    }, [postalValue, isSuccess, data])


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
                    name='postal_code'
                    label='Codigo postal'
                    rules={[{ len: 5, message: 'El codigo postal cosnta de 5 digitos' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name='state'
                    label='Estado'
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    name='municipality'
                    label='Municipio'
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    name='colony'
                    label='Colonia'
                    rules={[{ required: true, message: 'La colonia es requerida' }]}
                >
                    <Select
                        loading={isFetching}
                        labelInValue
                        disabled={!dataColonies?.colonies?.length}
                        options={dataColonies?.colonies.map(colony => ({
                            label: colony.name,
                            value: colony.colony_id,
                        }))}
                    />
                </Form.Item>
                <Form.Item
                    name='street'
                    label='calle y número'
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name='references'
                    label='Referencias'
                >
                    <Input />
                </Form.Item>
            </Form>
        </Drawer>
    )
}
