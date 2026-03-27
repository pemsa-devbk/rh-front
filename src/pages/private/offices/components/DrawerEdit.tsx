import { Button, Drawer, Form, Input, Space } from 'antd'
import { useEffect } from 'react'
import { UpdateOfficeDTO, Office } from '../../../../api/interfaces/office';
import { useUpdateOffice } from '../../../../hooks/office';
import { getUpdatedFields } from '../../../../helpers/getUpdateFields';

interface Props {
    open: boolean;
    onClose: () => void;
    office?: Office;
}

export const DrawerEdit = ({ onClose, open, office }: Props) => {

    const [form] = Form.useForm<UpdateOfficeDTO>();
    const { mutate } = useUpdateOffice(() => {
        form.resetFields();
        onClose();
    });

    const handleFormSubmit = (values: UpdateOfficeDTO) => {
        const changes: UpdateOfficeDTO = getUpdatedFields(office!, values);
        mutate({ enterpriseID: office?.enterprise_id!, formOffice: changes, officeID: office!.office_id })
    }

    useEffect(() => {
        if (office && open) form.setFieldsValue(office);
    }, [office, open])

    return (
        <Drawer
            title="Editar oficina"
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
            >
                <Form.Item
                    label="Nombre"
                    name="name"
                >
                    <Input />
                </Form.Item>
            </Form>
        </Drawer>
    )
}
