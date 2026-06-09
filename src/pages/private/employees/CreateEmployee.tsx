
import { useRef, useState } from 'react'
import { Button, Col, Flex, message, Row, Steps, Typography } from 'antd';
import { CreateEmployeeDTO, EmployeForm } from '../../../api/interfaces/employee';
import { useCreateEmployee } from '../../../hooks/employee';
import { instance } from '../../../api/rh';
import { useNavigate } from 'react-router-dom';
import { StepAddress } from '../address/components/StepAddress';
import { StepBanking } from '../bank/components/StepBanking';
import { StepContract } from '../contract/components/StepContract';
import { StepEmployee } from './components/StepEmployee';
import { StepMedical } from '../medical/components/StepMedical';
import { StepEnterpriseInformation } from '../enterprise-info/components/StepEnterpriseInformation';

type WizardData = Partial<EmployeForm>;
export interface FormStepRef {
    submit: () => void;
    back: () => void;
}


type ImageKey = 'FT_PR' | 'FR_PR';
type ImagesState = Record<ImageKey, File | undefined>;

export const CreateEmployee = () => {
    const [current, setCurrent] = useState(0);
    const [messageApi, contextMessage] = message.useMessage();
    const [formData, setFormData] = useState<WizardData>({});
    const formRef = useRef<FormStepRef>(null);
    const [images, setImages] = useState<ImagesState>({ FT_PR: undefined, FR_PR: undefined });
    const [isUploadingImages, setIsUploadingImages] = useState(false);
    const navigate = useNavigate();

    const uploadImage = async (fileId: number, key: ImageKey, file: File, userId: string) => {
        const formImage = new FormData();
        formImage.append(key, file);
        // Ajusta el endpoint según tu API
        await instance.post(`files/${fileId}/employees/${userId}`, formImage);
    };
    const submitImages = async (userId: string) => {
        const entries = Object.entries(images) as [ImageKey, File | undefined][];
        const uploads = entries
            .filter((entry): entry is [ImageKey, File] => entry[1] !== undefined)
            .map(([key, file], idx) => uploadImage(idx+1, key, file, userId));

        await Promise.all(uploads);
    };


    const { mutate: mutateCreate } = useCreateEmployee(async () => {
        const userId = formData.user_id!;
        setIsUploadingImages(true);
        try {
            await submitImages(userId);
            messageApi.success('Empleado creado correctamente');
            setFormData({});
            setImages({ FT_PR: undefined, FR_PR: undefined });
            navigate('/empleados'); // Ajusta la ruta según tu app
        } catch (error) {
            messageApi.error('El empleado fue creado pero ocurrió un error al subir las imágenes');
        } finally {
            setIsUploadingImages(false);
        }
    });

    const onChange = (value: number) => {
        setCurrent(value);
    };


    const handleNext = (values: Partial<EmployeForm>) => {
        if (!images.FR_PR || !images.FT_PR) {
            return messageApi.open({ type: 'error', content: 'Las imágenes son obligatorias' });
        }
        setFormData((prev) => ({ ...prev, ...values }));
        setCurrent((prev) => prev + 1);
    };

    const handleBack = () => setCurrent((prev) => prev - 1);



    const handleSubmit = (values: Partial<EmployeForm>) => {
        const merged = { ...formData, ...values } as EmployeForm;
        setFormData(merged);
        const {
            colony, postal_code, street, references, state, municipality, blood_type, allergies, nss, diseases, enterprise, office, department, area, position, type_contract, validity_contract, phone_enterprise, cell_phone_enterprise, ext, have_license, type_license, issue_date, validity_license, boss, bank, CLABE, account_number, email_enterprise, ...rest
        } = merged;

        const formEmployee: CreateEmployeeDTO = {
            ...rest,
            position_id: position.value!,
            boss_id: boss?.value!,
        };

        if (have_license) formEmployee.license = { issue_date, type: type_license, validity: validity_license };

        formEmployee.contract = { type: type_contract, validity: validity_contract };
        formEmployee.address = { colony_id: colony.value!, references, street };
        formEmployee.enterpiseInformation = { cell_phone: cell_phone_enterprise, email: email_enterprise, ext, phone: phone_enterprise };

        if (allergies || blood_type || diseases || nss) formEmployee.medical = { allergies, blood_type, diseases, nss };

        if (bank) formEmployee.banking = { bank_id: bank.value!, account_number, CLABE };


        mutateCreate(formEmployee);
    }

    const handleImages = (key: string, file: File) => {
        setImages((old) => ({ ...old, [key]: file }));
    }

    return (
        <Flex vertical align='center' style={{ background: '#fff', padding: '2rem 2.5rem' }}>
            {contextMessage}
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
                    }
                ]}
            />
            <div style={{ width: '100%' }}>
                {current === 0 && (
                    <StepEmployee initialValues={formData} onNext={handleNext} ref={formRef} onBack={handleBack} handleImage={handleImages} />
                )}
                {current === 1 && (
                    <StepAddress initialValues={formData} onNext={handleNext} onBack={handleBack} ref={formRef} />
                )}
                {current === 2 && (
                    <StepMedical initialValues={formData} onNext={handleNext} onBack={handleBack} ref={formRef} />
                )}
                {current === 3 && (
                    <StepContract initialValues={formData} onNext={handleNext} onBack={handleBack} ref={formRef} />
                )}
                {current == 4 && (
                    <StepEnterpriseInformation initialValues={formData} onNext={handleNext} onBack={handleBack} ref={formRef} />
                )}
                {current == 5 && (
                    <StepBanking initialValues={formData} onNext={handleSubmit} onBack={handleBack} ref={formRef} />
                )}
            </div>

            <Row align='middle' style={{ width: '100%', padding: '2rem 2.5rem' }}>
                <Col span={24}>
                    <Flex justify='flex-end'>
                        <Button
                            color='default'
                            style={{ color: '#c9c9c9' }}
                            variant='text'
                            onClick={() => formRef.current?.back()}
                        >
                            Atrás
                        </Button>
                        <div style={{ borderRight: '1px solid #c9c9c9', margin: '0 .5rem' }} />
                        <Button
                            color='primary'
                            variant='text'
                            loading={isUploadingImages}
                            onClick={() => formRef.current?.submit()}
                        >
                            {current === 5 ? 'Guardar' : 'Siguiente'}
                        </Button>
                    </Flex>
                </Col>
            </Row>
        </Flex>
    )
}
