import { Area } from '../../../../api/interfaces/area';
import { Button, Drawer, Form, Input, Space } from 'antd';
import { FormPosition } from '../../../../api/interfaces/position';
import { useCreatePosition } from '../../../../hooks/position';
import { useInfiniteEnterprises } from '../../../../hooks/enterprise';
import { useInfiniteOfficesByEnterprice } from '../../../../hooks/office';
import { useEffect } from 'react';
import { Enterprise } from '../../../../api/interfaces/enterprise';
import { Office } from '../../../../api/interfaces/office';
import { SelectWithSearch } from '../../../../components/SelectWithSearch';
import { Department } from '../../../../api/interfaces/department';
import { getInitialValues } from '../../../../helpers/getInitalValues';
import { useInfiniteDepartmentsByOffice } from '../../../../hooks/department';
import { useInfiniteAreasByDepartment } from '../../../../hooks/area';

interface Props {
    open: boolean;
    onClose: () => void;
    enterprise?: Enterprise;
    office?: Office;
    department?: Department;
    area?: Area;
}

export const DrawerCreate = ({ onClose, open, area, enterprise, department, office }: Props) => {
    const [form] = Form.useForm<FormPosition>();
    const { mutate } = useCreatePosition(() => {
        form.resetFields();
        onClose();
    });

    const enterpriseValue = Form.useWatch('enterprise', form);
    const officeValue = Form.useWatch('office', form);
    const departmentValue = Form.useWatch('department', form);

    const isFixed = { enterprise: !!enterprise || !!office || !!department || !!area, office: !!office || !!department || !!area, department: !!department || !!area, area: !!area };

    const handleFormSubmit = (values: FormPosition) => {
        const finalAreaID = area?.area_id || values.area.value!;
        const positionData = {name: values.name};
        mutate({ areaID: finalAreaID, body: positionData })
    }


    const handleChangeValue = (key: 'enterprise' | 'office' | 'department') => {
        if (key == 'enterprise') form.resetFields(['office', 'department', 'area'])
        if (key == 'office') form.resetFields(['department', 'area'])
        if (key == 'department') form.resetFields(['area'])
    }

    useEffect(() => {
        if (open) form.setFieldsValue(getInitialValues(enterprise, office, department, area));
    }, [open])

    return (
        <Drawer
            title={`Añadir puesto`}
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
                    useQuery={(search, enabled) => useInfiniteEnterprises((open && !isFixed.enterprise && enabled), search)}
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
                    labelInValue
                    valueKey='department_id'
                    useQuery={(search, enabled) => useInfiniteDepartmentsByOffice(officeValue?.value || NaN, (open && !isFixed.department && enabled), search)}
                    required
                    onChange={(_) => handleChangeValue('department')}
                />

                <SelectWithSearch<Area>
                    label="Area"
                    name="area"
                    disabled={isFixed.area || !departmentValue}
                    placeHolder={"Seleccione el area"}
                    labelKey='name'
                    labelInValue
                    valueKey='area_id'
                    useQuery={(search, enabled) => useInfiniteAreasByDepartment(departmentValue?.value || NaN, (open && !isFixed.area && enabled), search)}
                    required
                />
            </Form>
        </Drawer>
    )
}
