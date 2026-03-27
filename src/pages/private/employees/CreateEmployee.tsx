
import { useRef, useState } from 'react'
import { Button, Col, Flex, Row, Steps, Typography } from 'antd';
import { FormEmployee } from './components/FormEmployee';
import { CreateEmployeeDTO, EmployeForm } from '../../../api/interfaces/employee';
import { FormMedical } from './components/FormMedical';
import { FormAddress } from './components/FormAddress';
import { FormContract } from './components/FormContract';
import { FormEnterpriseInformation } from './components/FormEnterpriseInformation';
import { FormBanking } from './components/FormBanking';
import { useCreateEmployee } from '../../../hooks/employee';

type WizardData = Partial<EmployeForm>;
export interface FormStepRef {
    submit: () => void;
    back: () => void;
}

export const CreateEmployee = () => {
    const [current, setCurrent] = useState(0);
    const [formData, setFormData] = useState<WizardData>({});
    const formRef = useRef<FormStepRef>(null);
    const { mutate: mutateCreate } = useCreateEmployee();

    const onChange = (value: number) => {
        setCurrent(value);
    };

    const handleNext = (values: Partial<EmployeForm>) => {
        setFormData((prev) => ({ ...prev, ...values }));
        setCurrent((prev) => prev + 1);
    };

    const handleBack = () => setCurrent((prev) => prev - 1);

    const handleSubmit = (values: Partial<EmployeForm>) => {
        setFormData((prev) => ({ ...prev, ...values }));
        const {
            colony, postal_code, street, references, state, municipality, blood_type, allergies, nss, diseases, enterprise, office, department, area, position, type_contract, validity, email, phone, cell_phone, ext, have_license, type_license, issue_date, validity_license, user_chief, bank, CLABE, account_number, ...rest
        } = { ...formData, ...values } as EmployeForm;
        let formEmployee: CreateEmployeeDTO = { ...rest, position_id: 1, user_chief_id: user_chief?.value! };
        if (have_license) formEmployee.license = { issue_date, type: type_license, validity: validity_license };
        formEmployee.contract = { type: type_contract, validity };
        formEmployee.address = { colony_id: colony.value!, references, street };
        if(allergies || blood_type || diseases || nss)formEmployee.medical = { allergies, blood_type, diseases, nss };
        formEmployee.enterpiseInformation = { cell_phone, email, ext, phone };
        if (bank) formEmployee.banking = { bank_id: bank.value!, account_number, CLABE };
        mutateCreate(formEmployee);
    }
    return (
        <Flex vertical align='center' style={{ background: '#fff', padding: '2rem 2.5rem' }}>
            <Typography.Title level={3}>Crear empleado</Typography.Title>
            <Typography.Text>Llene los campos solicititados y complete los 7 pasos</Typography.Text>
            <Steps
                style={{ marginTop: '3rem', marginBottom: '3rem' }}
                current={current}
                onChange={onChange}
                direction='horizontal'
                type='default'
                items={[
                    {
                        title: 'Personal',
                        description: 'Datos generales',
                        disabled: false
                    },
                    {
                        title: 'Domicilio',
                        description: 'Dirección',
                        disabled: false
                    },
                    {
                        title: 'Medica',
                        description: 'Seguro, etc',
                        disabled: false
                    },
                    {
                        title: 'Contrato',
                        description: 'Puesto, etc',
                        disabled: false
                    },
                    {
                        title: 'Empresa',
                        description: 'Correo, etc',
                        disabled: false
                    },
                    {
                        title: 'Banco',
                        description: 'Deposito',
                        disabled: false
                    },
                    // {
                    //     title: 'Documentos',
                    //     description: 'Foto, INE, etc',
                    //     disabled: false
                    // },
                ]}
            />
            <div style={{ width: '100%' }}>
                {current === 0 && (
                    <FormEmployee initialValues={formData} onNext={handleNext} ref={formRef} onBack={handleBack} />
                )}
                {current === 1 && (
                    <FormAddress initialValues={formData} onNext={handleNext} onBack={handleBack} ref={formRef} />
                )}
                {current === 2 && (
                    <FormMedical initialValues={formData} onNext={handleNext} onBack={handleBack} ref={formRef} />
                )}
                {current === 3 && (
                    <FormContract initialValues={formData} onNext={handleNext} onBack={handleBack} ref={formRef} />
                )}
                {current == 4 && (
                    <FormEnterpriseInformation initialValues={formData} onNext={handleNext} onBack={handleBack} ref={formRef} />
                )}
                {current == 5 && (
                    <FormBanking initialValues={formData} onNext={handleSubmit} onBack={handleBack} ref={formRef} />
                )}
            </div>

            <Flex flex={1} vertical style={{ height: '100%' }}>
                {/* <Flex vertical style={{ background: '#fff', padding: '2rem 2.5rem', marginBottom: '1rem' }}>

                </Flex> */}

                <Row align='middle' gutter={0} style={{ background: '#fff', padding: '2rem 2.5rem' }}>
                    <Col span={3}>

                    </Col>
                    <Col span={20} offset={1} >



                    </Col>
                    {
                        current <= 5 &&
                        <Col span={24}>
                            <Flex justify='flex-end'>
                                <Button color='default' style={{ color: '#c9c9c9' }} variant='text' onClick={() => formRef.current?.back()}>Atras</Button>
                                <div style={{ borderRight: '1px solid #c9c9c9', margin: '0 .5rem' }}></div>
                                {
                                    current == 5 ?
                                        <Button color='primary' variant='text' onClick={() => formRef.current?.submit()} >Guardar</Button>
                                        :
                                        <Button color='primary' variant='text' onClick={() => formRef.current?.submit()}>Siguiente</Button>
                                }
                            </Flex>
                        </Col>
                    }
                </Row>

            </Flex>
        </Flex>
    )
}
