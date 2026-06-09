import { Button, DatePicker, Drawer, Form, Radio, Space } from 'antd'
import { useEffect } from 'react'
import { CreateContractDTO } from '../../../../api/interfaces/contract';
import { useCreateContract } from '../../../../hooks/contract';
import dayjs from '../../../../helpers/dayjs'

interface Props {
    open: boolean;
    onClose: (key: string) => void;
    modalKey: string;
    employeeID: string;
}

export const DrawerCreate = ({ employeeID, modalKey, onClose, open }: Props) => {
    const [form] = Form.useForm<CreateContractDTO>();
    const typevalue = Form.useWatch('type', form);
    const { mutate: createContract } = useCreateContract(() => {
        onClose(modalKey);
    });

    const handleFormSubmit = (values: CreateContractDTO) => {
        createContract({ form: values, employeeID: employeeID });
    }

    useEffect(() => {
        if (typevalue == 2) form.setFieldsValue({ validity: undefined })
    }, [typevalue])

    return (
        <Drawer
            title='Nuevo contrato'
            open={open}
            onClose={() => onClose(modalKey)}
            extra={
                <Space>
                    <Button onClick={() => onClose(modalKey)}>Cancel</Button>
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
                    name='type'
                    label='Tipo de contrato'
                    rules={[{ required: true, message: 'Seleccione una opción' }]}
                >
                    <Radio.Group block buttonStyle='outline' optionType='button'>
                        <Radio value={1}>TEMPORAL</Radio>
                        <Radio value={2}>INDETERMINADO</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    name='validity'
                    label='Fecha termino'
                    rules={[{ required: (typevalue && typevalue == 1), message: 'Ingrese la fecha de termino' }]}
                    getValueProps={(value) => ({
                        value: value ? dayjs(value) : null
                    })}
                    normalize={(value) => value ? value.format('YYYY-MM-DD') : null}
                >
                    <DatePicker disabled={!typevalue || typevalue == 2} placeholder='' style={{ width: '100%' }} format={'YYYY-MM-DD'} />
                </Form.Item>
            </Form>
        </Drawer>
    )
}
