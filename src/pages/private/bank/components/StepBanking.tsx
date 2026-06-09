import { forwardRef, useImperativeHandle } from 'react'
import { Col, Form, Input, Row } from 'antd';
import { SelectWithSearch } from '../../../../components/SelectWithSearch';
import { useInfiniteBanks } from '../../../../hooks/bank';
import { StepSix } from '../../../../api/interfaces/employee';
import { Bank } from '../../../../api/interfaces/banking';
import { FormStepRef } from '../../employees/CreateEmployee';

interface Props {
  initialValues?: Partial<StepSix>;
  onNext: (values: StepSix) => void;
  onBack: () => void;
}

export const StepBanking = forwardRef<FormStepRef, Props>(({ onBack, onNext, initialValues }, ref) => {
  const [form] = Form.useForm<StepSix>();

  useImperativeHandle(ref, () => ({
    submit: () => form.submit(),
    back: onBack,
  }));

  const bankValue = Form.useWatch('bank', form);

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
          <SelectWithSearch<Bank>
            labelInValue
            label="Banco"
            name="bank"
            allowClear
            placeHolder={"Seleccione el banco"}
            labelKey='name'
            valueKey='bank_id'
            useQuery={(search, enabled) => useInfiniteBanks(enabled, search)}
            // required
          />
        </Col>
        <Col span={8}>
          <Form.Item
            name='CLABE'
            label='CLABE'
            rules={[{ len: 18, message: 'La CLABE interbancaria consta de 18 digitos' }, { required: !!bankValue, message: 'La CLABE interbancaria es obligatoria' }]}
          >
            <Input disabled={!bankValue} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name='account_number'
            label='Numero de'
            rules={[{ min: 13, max: 24, message: 'El numero de cuenta consta de 13 a 24 digitos' }, { required: !!bankValue, message: 'El numero de cuenta es obligatorio' }]}
          >
            <Input disabled={!bankValue} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
})
