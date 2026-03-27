
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { AddressForm } from '../../../../api/interfaces/address';
import { Col, Form, Input, Row, Select, Typography } from 'antd';
import { useColoniesByPostal } from '../../../../hooks/mx';
import { FormStepRef } from '../CreateEmployee';


interface Props {
    initialValues?: Partial<AddressForm>;
    onNext: (values: AddressForm) => void;
    onBack: () => void;
}

export const FormAddress = forwardRef<FormStepRef, Props>(({ onBack, onNext, initialValues }, ref) => {
    const [form] = Form.useForm<AddressForm>();
    const postalValue = Form.useWatch('postal_code', form);
    const { data, isFetching, isSuccess } = useColoniesByPostal(postalValue || '');

    useEffect(() => {
        if (postalValue?.length === 5 && isSuccess && data) {
            form.setFieldsValue({
                state: data.state_name,
                municipality: data.municipality_name,
            });
        }

        if (postalValue?.length < 5) {
            form.setFieldsValue({
                state: '',
                municipality: '',
                colony: undefined,
            });
        }
    }, [postalValue, isSuccess, data])

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
                        name='postal_code'
                        label='Codigo postal'
                        rules={[{ len: 5, message: 'El codigo postal cosnta de 5 digitos' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name='state'
                        label='Estado'
                    >
                        <Input disabled />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name='municipality'
                        label='Municipio'
                    >
                        <Input disabled />
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item
                        name='colony'
                        label='Colonia'
                        rules={[{ required: true, message: 'La colonia es requerida' }]}
                    >
                        <Select
                            loading={isFetching}
                            labelInValue
                            disabled={!data?.colonies?.length}
                            options={data?.colonies.map(colony => ({
                                label: colony.name,
                                value: colony.colony_id,
                            }))}
                        />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name='street'
                        label='calle y número'
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name='references'
                        label='Referencias'
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
})
