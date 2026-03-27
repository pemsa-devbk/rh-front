import { Button, Drawer, Form, Input, Space } from 'antd';
import { Area, FormUpdateArea, UpdateAreaDTO } from '../../../../api/interfaces/area';
import { useUpdateArea } from '../../../../hooks/area';
import { useEffect } from 'react';
import { SelectWithSearch } from '../../../../components/SelectWithSearch';
import { User } from '../../../../api/interfaces/user';
import { getUpdatedFields } from '../../../../helpers/getUpdateFields';
import { useInfiniteEmployees } from '../../../../hooks/employee';
import { getResponsible } from '../../../../helpers/getInitalValues';

interface Props {
    open: boolean;
    onClose: () => void;
    area?: Area;
}

export const DrawerEdit = ({ onClose, open, area }: Props) => {
    const { mutate } = useUpdateArea(() => {
        form.resetFields();
        onClose();
    });
    const [form] = Form.useForm<FormUpdateArea>();

    const handleFormSubmit = (values: FormUpdateArea) => {
        const formatData = {
            name: values.name, responsible_user_id: values.responsible_user?.value || null
        };
        const changes: UpdateAreaDTO = getUpdatedFields(area!, formatData);
        mutate({ body: changes, areaID: area!.area_id, departmentID: area!.department_id })
    }

    useEffect(() => {
        if (area && open) {
            const responsible_user = getResponsible(undefined, area);
            form.setFieldsValue({ name: area.name, responsible_user });
        }
    }, [area, open])

    return (
        <Drawer
            title={`Editar ${area?.name}`}
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

                <SelectWithSearch<User>
                    label="Usuario encargado"
                    name="responsible_user"
                    placeHolder="Seleccione el usuario"
                    labelInValue
                    labelKey='name'
                    valueKey='user_id'
                    allowClear
                    useQuery={(search, enabled) => useInfiniteEmployees(open && enabled, search)}
                />
            </Form>
        </Drawer>
    )
}
