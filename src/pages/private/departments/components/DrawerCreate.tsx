import { useCreateDepartment } from '../../../../hooks/department'
import { Button, Drawer, Form, Input, Space } from 'antd'
import { FormDepartment } from '../../../../api/interfaces/department';
import { Enterprise } from '../../../../api/interfaces/enterprise';
import { Office } from '../../../../api/interfaces/office';
import { useInfiniteEmployees } from '../../../../hooks/employee';
import { useInfiniteEnterprises } from '../../../../hooks/enterprise';
import { useInfiniteOfficesByEnterprice } from '../../../../hooks/office';
import { SelectWithSearch } from '../../../../components/SelectWithSearch';
import { Employee } from '../../../../api/interfaces/employee';
import { useEffect } from 'react';
import { getInitialValues } from '../../../../helpers/getInitalValues';

interface Props {
    open: boolean;
    onClose: () => void;
    enterprise?: Enterprise;
    office?: Office;
}

export const DrawerCreate = ({ onClose, open, enterprise, office }: Props) => {
    const [form] = Form.useForm<FormDepartment>();
    const { mutate } = useCreateDepartment(() => {
        form.resetFields();
        onClose();
    });

    const enterpriseValue = Form.useWatch('enterprise', form);
    const isFixed = { enterprise: !!enterprise || !!office, office: !!office };


    const handleFormSubmit = (values: FormDepartment) => {
        const finalOfficeID = office?.office_id || values.office.value!;
        const departmentData = {name: values.name, responsible_user_id: values.responsible_user?.value};
        mutate({ body: departmentData, officeID: finalOfficeID })
    }

    const handleChangeEnterprise = () => {
        form.resetFields(['office']);
    }

    useEffect(() => {
        if (open) form.setFieldsValue(getInitialValues(enterprise, office));
    }, [open])

    return (
        <Drawer
            title='Crear departamento'
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
                initialValues={
                    office ? { enterprise_id: office.enterprise_id, office_id: office.office_id }
                        : enterprise ? { enterprise_id: enterprise.enterprise_id } : undefined
                }
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
                    name="enterprise"
                    labelInValue
                    disabled={isFixed.enterprise}
                    placeHolder={"Seleccione la empresa"}
                    labelKey='name'
                    valueKey='enterprise_id'
                    useQuery={(search, enabled) => useInfiniteEnterprises((open && !isFixed.enterprise && enabled), search)}
                    required
                    onChange={handleChangeEnterprise}
                />

                <SelectWithSearch<Office>
                    label="Oficina"
                    name="office"
                    disabled={isFixed.office || !enterpriseValue}
                    placeHolder={"Seleccione la oficina"}
                    labelKey='name'
                    valueKey='office_id'
                    labelInValue
                    useQuery={(search, enabled) => useInfiniteOfficesByEnterprice(enterpriseValue?.value || '', (open && !isFixed.office && enabled), search)}
                    required
                />

                <SelectWithSearch<Employee>
                    labelInValue
                    label="Usuario encargado"
                    name="responsible_user"
                    placeHolder="Seleccione el usuario"
                    labelKey='name'
                    valueKey='user_id'
                    useQuery={(search, enabled) => useInfiniteEmployees(open && enabled, search)}
                />
            </Form>
        </Drawer>
    )
}
