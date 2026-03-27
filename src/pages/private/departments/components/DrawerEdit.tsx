import { useEffect } from 'react'
import { useUpdateDepartment } from '../../../../hooks/department'
import { Button, Drawer, Form, Input, Space } from 'antd'
import { Department, FormUpdateDepartment, UpdateDepartmentDTO } from '../../../../api/interfaces/department';
import { useInfiniteEmployees } from '../../../../hooks/employee';
import { SelectWithSearch } from '../../../../components/SelectWithSearch';
import { Employee } from '../../../../api/interfaces/employee';
import { getResponsible } from '../../../../helpers/getInitalValues';
import { getUpdatedFields } from '../../../../helpers/getUpdateFields';

interface Props {
    open: boolean;
    onClose: () => void;
    department?: Department;
}

export const DrawerEdit = ({ onClose, open, department }: Props) => {
    const [form] = Form.useForm<FormUpdateDepartment>();
    const { mutate } = useUpdateDepartment(() => {
        form.resetFields();
        onClose();
    });

    const handleFormSubmit = (values: FormUpdateDepartment) => {
        const formatData: UpdateDepartmentDTO = getUpdatedFields(department!, {name: values.name, responsible_user_id: values.responsible_user?.value || null});
        mutate({ body: formatData, officeID: department!.office_id, departmentID: department!.office_id })
    }

    useEffect(() => {
        if (department && open) {
            const responsible_user = getResponsible(department);
            form.setFieldsValue({name: department.name, responsible_user});
        }
    }, [department, open])
    return (
        <Drawer
            title='Editar departamento'
            open={open}
            onClose={onClose}
            extra={
                <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type='primary' onClick={() => form.submit()}>
                        Guardar
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
                >
                    <Input />
                </Form.Item>

                <SelectWithSearch<Employee>
                    labelInValue
                    label="Usuario encargado"
                    name="responsible_user"
                    placeHolder="Seleccione el usuario"
                    labelKey='name'
                    allowClear
                    valueKey='user_id'
                    useQuery={(search, enabled) => useInfiniteEmployees(open && enabled, search)}
                />
            </Form>
        </Drawer>
    )
}
