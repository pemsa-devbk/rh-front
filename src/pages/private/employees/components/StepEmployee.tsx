import { Col, DatePicker, Flex, Form, Input, InputNumber, Radio, Row, Select, Typography } from 'antd'
import { StepOneForm } from '../../../../api/interfaces/employee';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { FormStepRef } from '../CreateEmployee';
import dayjs from 'dayjs';
import { ProfileImageUpload } from '../../../../components/ProfileImageUpload';
import { SignatureImageUpload } from '../../../../components/SignatureImageUpload';

interface Props {
    initialValues?: Partial<StepOneForm>;
    onNext: (values: StepOneForm) => void;
    onBack: () => void;
    handleImage: (key: string, file: File) => void;
}

export const StepEmployee = forwardRef<FormStepRef, Props>(({ onNext, initialValues, onBack, handleImage }, ref) => {
    const [form] = Form.useForm<StepOneForm>();
    const haveLicenseValue = Form.useWatch('have_license', form);

    useImperativeHandle(ref, () => ({
        submit: () => form.submit(),
        back: onBack,
    }));

    useEffect(() => {
        if (!haveLicenseValue)
            form.setFieldsValue({ type_license: undefined, validity_license: undefined, issue_date: undefined })

    }, [haveLicenseValue])

    return (
        <Form
            layout='vertical'
            initialValues={initialValues}
            onFinish={onNext}
            form={form}
            variant='outlined'
        >
            <Row gutter={16} align={'middle'}>
                <Col xs={24} sm={10} md={8} lg={6} xl={4} xxl={4} >
                    <Flex vertical gap={30}>
                        <Typography.Text style={{ margin: 0, padding: 0 }}>Foto:</Typography.Text>
                        <ProfileImageUpload
                            handleImage={handleImage}
                            aspect={1}
                            showReset
                            showRotationSlider
                            showZoomSlider
                        />
                        <Typography.Text style={{ margin: 0, padding: 0 }}>Firma:</Typography.Text>
                        <SignatureImageUpload
                            handleImage={handleImage}
                            aspect={2}
                            showReset
                            showRotationSlider
                            showZoomSlider
                        />
                    </Flex>
                </Col>
                <Col xs={24} sm={14} md={16} lg={18} xl={20} xxl={20}>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name='name'
                                label='Nombre'
                                rules={[{ required: true, message: 'El nombre es obligatorio' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
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
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name='curp'
                                label='CURP'
                                rules={[{ required: true, message: 'El CURP es obligatorio' }, { len: 18, message: 'El CURP debe de tener 18 caracteres' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name='rfc'
                                label='RFC'
                                rules={[{ required: true, message: 'El RFC es obligatorio' }, { len: 13, message: 'El RFC debe de tener 13 caracteres' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
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
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name='email'
                                label='Correo personal'
                                rules={[{ required: true, type: 'email', message: 'El correo electronico personal es obligatorio' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name='cell_phone'
                                label='Teléfono personal'
                                rules={[{ len: 10, message: 'El teléfono consta de 10 digitos' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name='place_registration'
                                label='Lugar de registro'
                                rules={[{ required: true, message: 'El lugar de registro es obligatorio' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name='num_children'
                                label='Número de hijos'
                                rules={[{ required: true, message: 'Especifique el número de hijos' }]}
                            >
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
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
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                name='have_license'
                                label='¿Licencia de conducir?'
                                rules={[{ required: true, message: 'Seleccione el genero' }]}
                            >
                                <Radio.Group block buttonStyle='outline' optionType='button'>
                                    <Radio value={true}>Si</Radio>
                                    <Radio value={false}>No</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name='type_license'
                                label='Tipo de licencia'
                            >
                                <Radio.Group disabled={!haveLicenseValue} block buttonStyle='outline' optionType='button'>
                                    <Radio value={2}>Particular</Radio>
                                    <Radio value={1}>Mercantil</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name='issue_date'
                                label='Fecha de emision'
                                rules={[{ required: haveLicenseValue, message: 'La fecha de emision es obligatoria' }]}
                                getValueProps={(value) => ({
                                    value: value ? dayjs(value) : null
                                })}
                                normalize={(value) => value ? value.format('YYYY-MM-DD') : null}
                            >
                                <DatePicker disabled={!haveLicenseValue} placeholder='' style={{ width: '100%' }} format={'YYYY-MM-DD'} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name='validity_license'
                                label='Fecha de vencimiento'
                                rules={[{ required: haveLicenseValue, message: 'La fecha de vencimiento es obligatoria' }]}
                                getValueProps={(value) => ({
                                    value: value ? dayjs(value) : null
                                })}
                                normalize={(value) => value ? value.format('YYYY-MM-DD') : null}
                            >
                                <DatePicker disabled={!haveLicenseValue} placeholder='' style={{ width: '100%' }} format={'YYYY-MM-DD'} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Form>
    );
});
