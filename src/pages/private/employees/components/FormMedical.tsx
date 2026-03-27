import { Col, Form, Input, Row, Select, Typography } from 'antd'
import { CreateMedicalDTO } from '../../../../api/interfaces/medical';
import { forwardRef, useImperativeHandle } from 'react';
import { FormStepRef } from '../CreateEmployee';

interface Props {
  initialValues?: Partial<CreateMedicalDTO>;
  onNext: (values: CreateMedicalDTO) => void;
  onBack: () => void;
}

export const FormMedical = forwardRef<FormStepRef, Props>(({ onBack, onNext, initialValues }, ref) => {
  const [form] = Form.useForm();

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
            name='blood_type'
            label='Tipo de sangre'
          >
            <Select
              options={[
                { label: 'A+', value: 'A+' },
                { label: 'A-', value: 'A-' },
                { label: 'B+', value: 'B+' },
                { label: 'B-', value: 'B-' },
                { label: 'AB+', value: 'AB+' },
                { label: 'AB-', value: 'AB-' },
                { label: 'O+', value: 'O+' },
                { label: 'O-', value: 'O-' },
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name='allergies'
            label='Alergias'
          >
            <Input />
          </Form.Item>

        </Col>
        <Col span={8}>
          <Form.Item
            name='nss'
            label='Número de seguro social'
            rules={[{ len: 11, message: 'El número de seguro social debe contener 11 caracteres.' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name='diseases'
            label='Enfermedades'
          >
            <Input />
          </Form.Item></Col>
      </Row>
    </Form>
  )
});

