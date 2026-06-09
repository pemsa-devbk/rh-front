import { useUpdateEnterpise } from '../../../../hooks/enterprise'
import { Button, Drawer, Form, Space } from 'antd';
import { Enterprise, UpdateEnterpriseDTO } from '../../../../api/interfaces/enterprise';
import { useEffect } from 'react';
import TextArea from 'antd/es/input/TextArea';
import { getUpdatedFields } from '../../../../helpers/getUpdateFields';

interface Props {
    open: boolean;
    onClose: () => void;
    enterprise?: Enterprise;
}
export const DrawerEdit = ({ onClose, open, enterprise }: Props) => {
    const { mutate } = useUpdateEnterpise(() => {
        form.resetFields();
        onClose();
    });
    const [form] = Form.useForm<UpdateEnterpriseDTO>();

    const handleFormSubmit = (values: UpdateEnterpriseDTO) => {
        const changes: Partial<UpdateEnterpriseDTO> = getUpdatedFields(enterprise!, values);
        mutate({ body: changes, enterpriseID: enterprise!.enterprise_id })
    }

    useEffect(() => {
        if (open && enterprise) {
            form.setFieldsValue(enterprise);
        }
    }, [open, enterprise])

    return (
        <Drawer
            title="Editar empresa"
            open={open}
            onClose={onClose}
            extra={
                <Space>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button type="primary" onClick={() => form.submit()}>
                        Actualizar
                    </Button>
                </Space>
            }
        >
            <Form
                layout='vertical'
                form={form}
                onFinish={handleFormSubmit}
            >
                <Form.Item
                    label="Nombre"
                    name="name"
                    rules={[{ required: true, message: "El nombre es requerido" }]}
                >
                    <TextArea autoSize />
                </Form.Item>
                <Form.Item
                    label="Dirección"
                    name="address"
                    rules={[{ required: true, message: "La dirección es requerida" }]}
                >
                    <TextArea autoSize />
                </Form.Item>
            </Form>
        </Drawer>
    )
}
