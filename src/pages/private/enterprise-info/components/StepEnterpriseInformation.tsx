import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { Col, Form, Input, Row } from 'antd';
import { StepFive } from '../../../../api/interfaces/employee';
import { FormStepRef } from '../../employees/CreateEmployee';

interface Props {
    initialValues?: Partial<StepFive>;
    onNext: (values: StepFive) => void;
    onBack: () => void;
}
// TODO Si se va a poder crear desde las entidades empresa, oficina, departamento, area o puesto añadir props y seguir el ejemplo de DrawerCreatePosition para los fixed.

export const StepEnterpriseInformation = forwardRef<FormStepRef, Props>(({ onBack, onNext, initialValues }, ref) => {
    const [form] = Form.useForm<StepFive>();
    const phoneValue = Form.useWatch('phone_enterprise', form);

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
                        name='email_enterprise'
                        label='Correo electronico'
                        rules={[{ type: 'email', message: 'Formato no valido para correo' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name='phone_enterprise'
                        label='Telefono'
                        rules={[{ len: 10, message: 'El telefono consta de 10 digitos' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name='ext'
                        label='Extensión'
                        rules={[{ max: 6, message: 'La extensión consta de 5 digitos' }]}
                    >
                        <Input disabled={!phoneValue} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name='cell_phone_enterprise'
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
