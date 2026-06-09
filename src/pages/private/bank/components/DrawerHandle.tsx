import { Button, Drawer, Form, Input, Space } from 'antd';
import { Employee } from '../../../../api/interfaces/employee';
import { getUpdatedFields } from '../../../../helpers/getUpdateFields';
import { useEffect } from 'react';
import { SelectWithSearch } from '../../../../components/SelectWithSearch';
import { Bank, BankingInformationForm } from '../../../../api/interfaces/banking';
import { useBankingByEmployee, useCreateBanking, useInfiniteBanks, useUpdateBanking } from '../../../../hooks/bank';

interface Props {
    open: boolean;
    onClose: (key: string) => void;
    modalKey: string;
    employee: Employee;
}

export const DrawerHandle = ({ onClose, open, employee, modalKey }: Props) => {
    const { data } = useBankingByEmployee(employee.user_id);
    const [form] = Form.useForm<BankingInformationForm>();
    const bankValue = Form.useWatch('bank', form);


    const { mutate: update } = useUpdateBanking(() => {
        onClose(modalKey);
    });
    const { mutate: create } = useCreateBanking(() => {
        onClose(modalKey);
    });
    const handleFormSubmit = (values: BankingInformationForm) => {
        const dataSend = {
            CLABE: values.CLABE,
            account_number: values.account_number,
            bank_id: values.bank.value!
        };
        if (data) {
            const dataToUpdate = getUpdatedFields(data!, dataSend);
            if (Object.keys(dataToUpdate).length === 0) return;
            update({ form: dataToUpdate, employeeID: employee.user_id });
        } else {
            create({ form: dataSend, employeeID: employee.user_id });
        }
    }

    useEffect(() => {
        const bank = (data?.bank_id && data.bank_name) ? { label: data.bank_name, value: data.bank_id } : undefined;
        if (data && open) form.setFieldsValue({ ...data, bank });
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
                <SelectWithSearch<Bank>
                    labelInValue
                    label="Banco"
                    name="bank"
                    allowClear
                    placeHolder={"Seleccione el banco"}
                    labelKey='name'
                    valueKey='bank_id'
                    useQuery={(search, enabled) => useInfiniteBanks(enabled, search)}
                // required
                />
                <Form.Item
                    name='CLABE'
                    label='CLABE'
                    rules={[{ len: 18, message: 'La CLABE interbancaria consta de 18 digitos' }, { required: !!bankValue, message: 'La CLABE interbancaria es obligatoria' }]}
                >
                    <Input disabled={!bankValue} />
                </Form.Item>
                <Form.Item
                    name='account_number'
                    label='Numero de'
                    rules={[{ min: 13, max: 24, message: 'El numero de cuenta consta de 13 a 24 digitos' }, { required: !!bankValue, message: 'El numero de cuenta es obligatorio' }]}
                >
                    <Input disabled={!bankValue} />
                </Form.Item>
            </Form>
        </Drawer>
    )
}
