import { Button, Drawer, Form, Input, Space } from 'antd';
import { useCreateOffice } from '../../../../hooks/office';
import { FormOffice } from '../../../../api/interfaces/office';
import { useInfiniteEnterprises } from '../../../../hooks/enterprise';
import { Enterprise } from '../../../../api/interfaces/enterprise';
import { SelectWithSearch } from '../../../../components/SelectWithSearch';
import { useEffect } from 'react';
import { getInitialValues } from '../../../../helpers/getInitalValues';

interface Props {
    open: boolean;
    onClose: () => void;
    enterprise?: Enterprise;
}

export const DrawerCreate = ({ onClose, open, enterprise }: Props) => {
    const { mutate } = useCreateOffice(() => {
        form.resetFields();
        onClose();
    });
    const [form] = Form.useForm<FormOffice>();

    const handleFormSubmit = (values: FormOffice) => {
        const finalEnterpriseID = enterprise?.enterprise_id || values.enterprise?.value;
        const { enterprise: _, ...officeData } = values;
        mutate({ enterpriseID: finalEnterpriseID, formOffice: officeData })
    }

    useEffect(() => {
        if (open) form.setFieldsValue(getInitialValues(enterprise));
    }, [open])

    return (
        <Drawer
            title="Crear oficina"
            open={open}
            onClose={onClose}
            extra={
                <Space>
                    <Button onClick={onClose}>Cancel</Button>
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
                initialValues={enterprise ? { enterprise_id: enterprise.enterprise_id } : undefined}
            >
                <Form.Item
                    label="Nombre"
                    name="name"
                    rules={[{ required: true, message: "El nombre es requerido" }]}
                >
                    <Input />
                </Form.Item>

                <SelectWithSearch<Enterprise>
                    label="Empresa"
                    labelInValue
                    name="enterprise"
                    disabled={!!enterprise}
                    placeHolder="Seleccione la empresa"
                    labelKey='name'
                    valueKey='enterprise_id'
                    useQuery={(search, enabled) => useInfiniteEnterprises(open && !enterprise && enabled, search)}
                    required
                />
            </Form>
        </Drawer>
    )
}
