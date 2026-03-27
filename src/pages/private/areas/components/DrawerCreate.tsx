import { Button, Drawer, Form, Input, Space } from 'antd'
import { useCreateArea } from '../../../../hooks/area';
import { FormArea } from '../../../../api/interfaces/area';
import { useInfiniteEnterprises } from '../../../../hooks/enterprise';
import { Enterprise } from '../../../../api/interfaces/enterprise';
import { useEffect } from 'react';
import { useInfiniteOfficesByEnterprice } from '../../../../hooks/office';
import { Office } from '../../../../api/interfaces/office';
import { SelectWithSearch } from '../../../../components/SelectWithSearch';
import { User } from '../../../../api/interfaces/user';
import { Department } from '../../../../api/interfaces/department';
import { useInfiniteEmployees } from '../../../../hooks/employee';
import { useInfiniteDepartmentsByOffice } from '../../../../hooks/department';
import { getInitialValues } from '../../../../helpers/getInitalValues';

interface Props {
    open: boolean;
    onClose: () => void;
    enterprise?: Enterprise;
    office?: Office;
    department?: Department;
}
export const DrawerCreate = ({ onClose, open, enterprise, office, department }: Props) => {
    const [form] = Form.useForm<FormArea>();
    const { mutate } = useCreateArea(() => {
        form.resetFields();
        onClose();
    });
    

    const enterpriseValue = Form.useWatch('enterprise', form);
    const officeValue = Form.useWatch('office', form);

    const isFixed = { enterprise: !!enterprise || !!office || !!department, office: !!office || !!department, department: !!department };

    const handleFormSubmit = (values: FormArea) => {
        const areaData = {name: values.name, responsible_user_id: values.responsible_user?.value};
        const finalDepartmentID = department?.department_id || values.department.value!;
        mutate({ body: areaData, departmentID: finalDepartmentID });
    }

    const handleChangeValue = (key: 'enterprise' | 'office') => {
        if (key == 'enterprise') form.resetFields(['office', 'department'])
        if (key == 'office') form.resetFields(['department'])
    }

    useEffect(() => {
        if(open)form.setFieldsValue(getInitialValues(enterprise, office, department));
    }, [open])


    return (
        <Drawer
            title="Crear area"
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
                    rules={[{ required: true, message: "El nombre es requerido" }]}
                >
                    <Input />
                </Form.Item>

                <SelectWithSearch<Enterprise>
                    labelInValue
                    label="Empresa"
                    name="enterprise"
                    disabled={isFixed.enterprise}
                    placeHolder={"Seleccione la empresa"}
                    labelKey='name'
                    valueKey='enterprise_id'
                    useQuery={ (search, enabled) => useInfiniteEnterprises((open && !isFixed.enterprise && enabled), search)}
                    required
                    onChange={(_) => handleChangeValue('enterprise')}
                />

                <SelectWithSearch<Office>
                    labelInValue
                    label="Oficina"
                    name="office"
                    disabled={isFixed.office || !enterpriseValue}
                    placeHolder={"Seleccione la oficina"}
                    labelKey='name'
                    valueKey='office_id'
                    useQuery={(search, enabled) => useInfiniteOfficesByEnterprice(enterpriseValue?.value || '', (open && !isFixed.office && enabled), search)}
                    required
                    onChange={(_) => handleChangeValue('office')}
                />

                <SelectWithSearch<Department>
                    label="Departamento"
                    name="department"
                    disabled={isFixed.department || !officeValue}
                    placeHolder={"Seleccione el departamento"}
                    labelKey='name'
                    valueKey='department_id'
                    useQuery={(search, enabled) =>  useInfiniteDepartmentsByOffice(officeValue?.value || NaN, (open && !isFixed.department && enabled), search)}
                    required
                />

                <SelectWithSearch<User>
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
