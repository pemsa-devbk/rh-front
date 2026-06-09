import { Col, DatePicker, Form, Input, InputNumber, Radio, Row } from 'antd'
import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { SelectWithSearch } from '../../../../components/SelectWithSearch'
import { Enterprise } from '../../../../api/interfaces/enterprise'
import { useInfiniteEnterprises } from '../../../../hooks/enterprise'
import { Office } from '../../../../api/interfaces/office'
import { useInfiniteOfficesByEnterprice } from '../../../../hooks/office'
import { Department } from '../../../../api/interfaces/department'
import { useInfiniteDepartmentsByOffice } from '../../../../hooks/department'
import { Area } from '../../../../api/interfaces/area'
import { useInfiniteAreasByDepartment } from '../../../../hooks/area'
import { Position } from '../../../../api/interfaces/position'
import { useInfinitePositionsByArea } from '../../../../hooks/position'
import { Employee, StepFour } from '../../../../api/interfaces/employee'
import { useInfiniteEmployees } from '../../../../hooks/employee'
import { getColoniesByPostal } from '../../../../api/mx'
import { FormStepRef } from '../../employees/CreateEmployee'
import dayjs from '../../../../helpers/dayjs'

interface Props {
    initialValues?: Partial<StepFour>;
    onNext: (values: StepFour) => void;
    onBack: () => void;
}

export const StepContract = forwardRef<FormStepRef, Props>(({ initialValues, onNext, onBack }, ref) => {

    const [form] = Form.useForm<StepFour>();
    const enterpriseValue = Form.useWatch('enterprise', form);
    const officeValue = Form.useWatch('office', form);
    const departmentValue = Form.useWatch('department', form);
    const areaValue = Form.useWatch('area', form);
    const typevalue = Form.useWatch('type_contract', form);

    const handleChangeValue = (key: 'enterprise' | 'office' | 'department' | 'area') => {
        if (key == 'enterprise') form.setFieldsValue({ office: undefined, department: undefined, area: undefined, position: undefined })
        // if (key == 'office') form.setFieldsValue(['department', 'area', 'position'])
        if (key == 'office') form.setFieldsValue({ department: undefined, area: undefined, position: undefined })
        if (key == 'department') form.setFieldsValue({ area: undefined, position: undefined })
        if (key == 'area') form.setFieldsValue({ position: undefined })
    }

    useEffect(() => {
        if (typevalue == 2) form.setFieldsValue({ validity_contract: undefined })
    }, [typevalue])

    useImperativeHandle(ref, () => ({
        submit: () => form.submit(),
        back: onBack,
    }));



    return (
        <Form
            layout='vertical'
            initialValues={initialValues}
            onFinish={onNext}
            form={form}
            variant='outlined'
        >
            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item
                        name='user_id'
                        label='NO. de empleado'
                        rules={[{ required: true, message: 'El ID del empleado es obligatorio' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
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
                </Col>
                <Col span={8}>
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
                </Col>
                <Col span={8}>
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
                </Col>
                <Col span={8}>
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
                </Col>
                <Col span={8}>
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
                </Col>

                <Col span={8}>
                    <SelectWithSearch<Employee>
                        label="jefe directo"
                        name="boss"
                        placeHolder={"Seleccione el jefe directo"}
                        labelKey='name'
                        labelInValue
                        valueKey='user_id'
                        useQuery={(search, enabled) => useInfiniteEmployees(enabled, search)}
                        required
                    />
                </Col>

                <Col span={8}>
                    <Form.Item
                        name='salary'
                        label='Salario'
                        rules={[{ required: true, message: 'El salario es obligatorio' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name='cp_csf'
                        label='CP de constancia de situación fiscal'
                        rules={[
                            {
                                validator(_, value) {
                                    if (value) {
                                        if (value.length != 5) {
                                            return Promise.reject(new Error('El codigo postal debe contener 5 caracteres'))
                                        } else {
                                            return new Promise((res, rej) => {
                                                getColoniesByPostal(value)
                                                    .then(() => res)
                                                    .catch(error => {
                                                        if (error instanceof Error)
                                                            return rej(error)
                                                        else return rej(new Error('Error en la validación de codigo postal'))
                                                    })
                                            })
                                        }
                                    }
                                    return Promise.resolve();
                                },
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
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
                </Col>

                <Col span={8}>
                    <Form.Item
                        name='type_contract'
                        label='Tipo de contrato'
                        rules={[{ required: true, message: 'Seleccione una opción' }]}
                    >
                        <Radio.Group block buttonStyle='outline' optionType='button'>
                            <Radio value={1}>TEMPORAL</Radio>
                            <Radio value={2}>INDETERMINADO</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item
                        name='validity_contract'
                        label='Fecha termino'
                        rules={[{ required: (typevalue && typevalue == 1), message: 'Ingrese la fecha de termino' }]}
                        getValueProps={(value) => ({
                            value: value ? dayjs(value) : null
                        })}
                        normalize={(value) => value ? value.format('YYYY-MM-DD') : null}
                    >
                        <DatePicker disabled={!typevalue || typevalue == 2} placeholder='' style={{ width: '100%' }} format={'YYYY-MM-DD'} />
                    </Form.Item>
                </Col>

                <Col span={8}>
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
                </Col>
                <Col span={8}>
                    <Form.Item
                        name='cuip'
                        label='CUIP'
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name='num_infonavit'
                        label='Número de credito infonavit'
                        rules={[{ len: 10, message: 'El número de creidto infonavit debe contener 8 digitos' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name='cred_fonacot'
                        label='Número de credito fonacot'
                        rules={[{ len: 10, message: 'El número de creidto fonacot debe contener 20 digitos' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name='have_alimony'
                        label='Pensión alimenticia?'
                        rules={[{ required: true, message: 'Seleccione una opcion' }]}
                    >
                        <Radio.Group block buttonStyle='outline' optionType='button'>
                            <Radio value={true}>Si</Radio>
                            <Radio value={false}>No</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
})
