import { useEffect } from 'react'
import { Employee, UpdateEmployeeForm } from '../../../../api/interfaces/employee';
import { Button, DatePicker, Drawer, Form, InputNumber, Radio, Space } from 'antd';
import dayjs from '../../../../helpers/dayjs'
import { getUpdatedFields } from '../../../../helpers/getUpdateFields';
import { useInfiniteEmployees, useUpdateEmployee } from '../../../../hooks/employee';
import { SelectWithSearch } from '../../../../components/SelectWithSearch';
import { Enterprise } from '../../../../api/interfaces/enterprise';
import { useInfiniteEnterprises } from '../../../../hooks/enterprise';
import { Office } from '../../../../api/interfaces/office';
import { useInfiniteOfficesByEnterprice } from '../../../../hooks/office';
import { Department } from '../../../../api/interfaces/department';
import { useInfiniteDepartmentsByOffice } from '../../../../hooks/department';
import { Area } from '../../../../api/interfaces/area';
import { useInfiniteAreasByDepartment } from '../../../../hooks/area';
import { Position } from '../../../../api/interfaces/position';
import { useInfinitePositionsByArea } from '../../../../hooks/position';

interface Props {
    open: boolean;
    onClose: (key: string) => void;
    modalKey: string;
    employee: Employee;
}

export const DrawerEditPosition = ({ employee, onClose, open, modalKey }: Props) => {
    const [form] = Form.useForm<UpdateEmployeeForm>();
    const enterpriseValue = Form.useWatch('enterprise', form);
    const officeValue = Form.useWatch('office', form);
    const departmentValue = Form.useWatch('department', form);
    const areaValue = Form.useWatch('area', form);

    const { mutate } = useUpdateEmployee(() => {
        onClose(modalKey);
    });
    const handleFormSubmit = (values: UpdateEmployeeForm) => {
        const dataCompare = {
            boss_id: values.boss?.value,
            salary: values.salary,
            have_uniform: values.have_uniform,
            date_entry: values.date_entry,
            position_id: values.position?.value
        };
        const dataToUpdate = getUpdatedFields(employee, dataCompare);
        if (Object.keys(dataToUpdate).length === 0) return;
        mutate({ form: dataToUpdate, employeeID: employee.user_id });
    }

    const handleChangeValue = (key: 'enterprise' | 'office' | 'department' | 'area') => {
        if (key == 'enterprise') form.setFieldsValue({ office: undefined, department: undefined, area: undefined, position: undefined })
        // if (key == 'office') form.setFieldsValue(['department', 'area', 'position'])
        if (key == 'office') form.setFieldsValue({ department: undefined, area: undefined, position: undefined })
        if (key == 'department') form.setFieldsValue({ area: undefined, position: undefined })
        if (key == 'area') form.setFieldsValue({ position: undefined })
    }

    useEffect(() => {
        if (open && employee) {
            // TODO Para información extra
            const boss = (employee.boss_id && employee.boss_name) ? { label: employee.boss_name, value: employee.boss_id } : undefined;
            const enterprise = (employee.enterprise_id && employee.enterprise_name) ? { label: employee.enterprise_name, value: employee.enterprise_id } : undefined;
            const office = (employee.office_id && employee.office_name) ? { label: employee.office_name, value: employee.office_id } : undefined;
            const department = (employee.department_id && employee.department_name) ? { label: employee.department_name, value: employee.department_id } : undefined;
            const area = (employee.area_id && employee.area_name) ? { label: employee.area_name, value: employee.area_id } : undefined;
            const position = (employee.position_id && employee.position_name) ? { label: employee.position_name, value: employee.position_id } : undefined;
            form.setFieldsValue({ ...employee, enterprise, boss, office, department, area, position });
        }
    }, [employee, open])

    return (
        <Drawer
            title={`Editar ${employee?.name}`}
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
                <SelectWithSearch<Enterprise>
                    labelInValue
                    label="Empresa"
                    name="enterprise"
                    placeHolder={"Seleccione la empresa"}
                    labelKey='name'
                    valueKey='enterprise_id'
                    useQuery={(search, enabled) => useInfiniteEnterprises(enabled, search)}
                    required
                    onChange={() => handleChangeValue('enterprise')}
                />
                <SelectWithSearch<Office>
                    labelInValue
                    label="Oficina"
                    name="office"
                    disabled={!enterpriseValue}
                    placeHolder={"Seleccione la oficina"}
                    labelKey='name'
                    valueKey='office_id'
                    useQuery={(search, enabled) => useInfiniteOfficesByEnterprice(enterpriseValue?.value || '', enabled, search)}
                    required
                    onChange={() => handleChangeValue('office')}
                />
                <SelectWithSearch<Department>
                    label="Departamento"
                    name="department"
                    disabled={!officeValue}
                    placeHolder={"Seleccione el departamento"}
                    labelKey='name'
                    labelInValue
                    valueKey='department_id'
                    useQuery={(search, enabled) => useInfiniteDepartmentsByOffice(officeValue?.value || NaN, enabled, search)}
                    required
                    onChange={(_) => handleChangeValue('department')}
                />
                <SelectWithSearch<Area>
                    label="Area"
                    name="area"
                    disabled={!departmentValue}
                    placeHolder={"Seleccione el area"}
                    labelKey='name'
                    labelInValue
                    valueKey='area_id'
                    useQuery={(search, enabled) => useInfiniteAreasByDepartment(departmentValue?.value || NaN, enabled, search)}
                    required
                    onChange={() => handleChangeValue('area')}
                />
                <SelectWithSearch<Position>
                    label="Puesto"
                    name="position"
                    disabled={!areaValue}
                    placeHolder={"Seleccione el puesto"}
                    labelKey='name'
                    labelInValue
                    valueKey='position_id'
                    useQuery={(search, enabled) => useInfinitePositionsByArea(areaValue?.value || NaN, enabled, search)}
                    required
                />
                <SelectWithSearch<Employee>
                    label="Jefe directo"
                    name="boss"
                    placeHolder={"Seleccione el jefe directo"}
                    labelKey='name'

                    labelInValue
                    valueKey='user_id'
                    useQuery={(search, enabled) => useInfiniteEmployees(enabled, search)}
                    required
                />
                <Form.Item
                    name='salary'
                    label='Salario'
                    rules={[{ required: true, message: 'El salario es obligatorio' }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name='date_entry'
                    label='Fecha de ingreso'
                    rules={[{ required: true, message: 'La fecha de ingreso es obligatoria' }]}
                    getValueProps={(value) => ({
                        value: value ? dayjs(value) : null
                    })}
                    normalize={(value) => value ? value.format('YYYY-MM-DD') : null}
                >
                    <DatePicker placeholder='' style={{ width: '100%' }} format={'YYYY-MM-DD'} />
                </Form.Item>
                <Form.Item
                    name='have_uniform'
                    label='¿Tiene uniforme?'
                    rules={[{ required: true, message: 'Seleccione una opcion' }]}
                >
                    <Radio.Group block buttonStyle='outline' optionType='button'>
                        <Radio value={true}>Si</Radio>
                        <Radio value={false}>No</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Drawer>
    )
}
