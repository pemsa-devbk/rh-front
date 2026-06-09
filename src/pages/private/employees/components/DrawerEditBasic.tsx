import { useEffect } from 'react'
import { Employee, UpdateEmployeeForm } from '../../../../api/interfaces/employee';
import { Button, DatePicker, Drawer, Form, Input, InputNumber, Radio, Select, Space } from 'antd';
import dayjs from '../../../../helpers/dayjs'
import { getColoniesByPostal } from '../../../../api/mx';
import { getUpdatedFields } from '../../../../helpers/getUpdateFields';
import { useUpdateEmployee } from '../../../../hooks/employee';

interface Props {
    open: boolean;
    onClose: (key: string) => void;
    modalKey: string;
    employee: Employee;
}

export const DrawerEditBasic = ({ employee, onClose, open, modalKey }: Props) => {
    const [form] = Form.useForm<UpdateEmployeeForm>();
    const { mutate } = useUpdateEmployee(() => {
        onClose(modalKey);
    });
    const handleFormSubmit = (values: UpdateEmployeeForm) => {
        const dataToUpdate = getUpdatedFields(employee, values);
        if (Object.keys(dataToUpdate).length === 0) return;
        mutate({ form: dataToUpdate, employeeID: employee.user_id });
    }

    useEffect(() => {
        if (open && employee)
            form.setFieldsValue({ ...employee });

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
                {/* <Form.Item
                    label="Número de empleado"
                    name='user_id'
                >
                    <Input />
                </Form.Item> */}
                <Form.Item
                    label="Nombre"
                    name="name"
                    rules={[{ required: true, message: 'El nombre es obligatorio' }]}

                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name='birthdate'
                    label='Fecha de nacimiento'
                    rules={[{ required: true, message: 'La fecha de nacimiento es obligatoria' }]}
                    getValueProps={(value) => ({
                        value: value ? dayjs(value) : null
                    })}
                    normalize={(value) => value ? value.format('YYYY-MM-DD') : null}
                >
                    <DatePicker placeholder='' style={{ width: '100%' }} format={'YYYY-MM-DD'} />
                </Form.Item>
                <Form.Item
                    name='curp'
                    label='CURP'
                    rules={[{ required: true, message: 'El CURP es obligatorio' }, { len: 18, message: 'El CURP debe de tener 18 caracteres' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name='rfc'
                    label='RFC'
                    rules={[{ required: true, message: 'El RFC es obligatorio' }, { len: 13, message: 'El RFC debe de tener 13 caracteres' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name='marital_status'
                    label='Estado civil'
                    rules={[{ required: true, message: 'El estado civil es obligatorio' }]}
                >
                    <Select
                        options={[
                            { label: 'Soltero', value: 1 },
                            { label: 'Casado', value: 2 },
                            { label: 'Divorciado', value: 3 },
                            { label: 'Viudo', value: 4 },
                            { label: 'En concubinato', value: 5 },
                        ]}
                    />
                </Form.Item>
                <Form.Item
                    name='email'
                    label='Correo personal'
                    rules={[{ required: true, type: 'email', message: 'El correo electronico personal es obligatorio' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name='cell_phone'
                    label='Teléfono personal'

                    rules={[{ len: 10, message: 'El teléfono consta de 10 digitos' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name='place_registration'
                    label='Lugar de registro'
                    rules={[{ required: true, message: 'El lugar de registro es obligatorio' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name='num_children'
                    label='Número de hijos'
                    rules={[{ required: true, message: 'Especifique el número de hijos' }]}
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    name='gender'
                    label='Genero'
                    rules={[{ required: true, message: 'Seleccione el genero' }]}
                >
                    <Radio.Group block buttonStyle='outline' optionType='button'>
                        <Radio value="M">Masculino</Radio>
                        <Radio value="F">Femenino</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    name='cuip'
                    label='CUIP'
                >
                    <Input />
                </Form.Item>
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
                <Form.Item
                    name='num_infonavit'
                    label='Número de credito infonavit'
                    rules={[{ len: 10, message: 'El número de creidto infonavit debe contener 8 digitos' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name='cred_fonacot'
                    label='Número de credito fonacot'
                    rules={[{ len: 10, message: 'El número de creidto fonacot debe contener 20 digitos' }]}
                >
                    <Input />
                </Form.Item>
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
                {/* <SelectWithSearch<Employee>
                    label="Jefe directo"
                    name="boss"
                    placeHolder={"Seleccione el jefe directo"}
                    labelKey='name'

                    labelInValue
                    valueKey='user_id'
                    useQuery={(search, enabled) => useInfiniteEmployees(enabled, search)}
                    required
                /> */}
            </Form>
        </Drawer>
    )
}
