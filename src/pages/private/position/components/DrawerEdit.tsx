import { useEffect } from 'react'
import { UpdatePositionDTO, Position } from '../../../../api/interfaces/position';
import { Button, Drawer, Form, Input, Space } from 'antd';
import { useUpdatePosition } from '../../../../hooks/position';
import { getUpdatedFields } from '../../../../helpers/getUpdateFields';

interface Props {
    open: boolean;
    onClose: () => void;
    position?: Position;
}

export const DrawerEdit = ({ onClose, open, position }: Props) => {

    const [form] = Form.useForm<UpdatePositionDTO>();
    const { mutate } = useUpdatePosition(() => {
        form.resetFields();
        onClose();
    });
    const handleFormSubmit = (values: UpdatePositionDTO) => {
        const changes: UpdatePositionDTO = getUpdatedFields(position!, values);
        mutate({ body: changes, positionID: position!.position_id, areaID: position!.area_id })
    }

    useEffect(() => {
        if (position && open) form.setFieldsValue(position);
    }, [position, open])

    return (
        <Drawer
            title={`Editar ${position?.name}`}
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
