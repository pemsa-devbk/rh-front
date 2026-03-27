import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { CreateEnterpiseInformationDTO } from '../../../../api/interfaces/enterpiseInformation';
import { FormStepRef } from '../CreateEmployee';
import { Col, Form, Input, Row } from 'antd';

interface Props {
    initialValues?: Partial<CreateEnterpiseInformationDTO>;
    onNext: (values: CreateEnterpiseInformationDTO) => void;
    onBack: () => void;
}
// TODO Si se va a poder crear desde las entidades empresa, oficina, departamento, area o puesto añadir props y seguir el ejemplo de DrawerCreatePosition para los fixed.

export const FormEnterpriseInformation = forwardRef<FormStepRef, Props>(({ onBack, onNext, initialValues }, ref) => {
    const [form] = Form.useForm<CreateEnterpiseInformationDTO>();
    const phoneValue = Form.useWatch('phone', form);

    useImperativeHandle(ref, () => ({
        submit: () => form.submit(),
        back: onBack,
    }));

    useEffect(() => {
      if(!phoneValue) form.setFieldValue('ext', undefined);
    }, [phoneValue])
    
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
                        name='email'
                        label='Correo electronico'
                        rules={[{ type: 'email', message: 'Formato no valido para correo' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name='phone'
                        label='Telefono'
                        rules={[{ len: 10, message: 'El telefono consta de 5 digitos' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name='ext'
                        label='Extensión'
                        rules={[{ max: 6, message: 'El telefono consta de 5 digitos' }]}
                    >
                        <Input disabled={!phoneValue} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name='cell_phone'
                        label='Celular'
                    // rules={[{ len: 6, message: 'El telefono consta de 5 digitos' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
})
