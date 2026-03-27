import { Button, Col, ColorPicker, Form, Image, Input, message, Modal, Row } from 'antd'
import { useState } from 'react';
import { Enterprise, FormSignature } from '../../../../api/interfaces/enterprise';
import { priviewSignature } from '../../../../api/enterprise';
import TextArea from 'antd/es/input/TextArea';
import { Color } from 'antd/es/color-picker';
import { useCreateSignature } from '../../../../hooks/enterprise';

interface Props {
    open: boolean;
    onClose: () => void;
    enterprise?: Enterprise;
}

export const ModalCreate = ({ onClose, open, enterprise }: Props) => {
    const [image, setImage] = useState<string>();
    const [form] = Form.useForm<FormSignature>();
    const { mutate } = useCreateSignature();
    const [loading, setLoading] = useState(false);

    const hanldePreview = async () => {
        setLoading(true);
        const values = form.getFieldsValue();
        try {
            const data = await priviewSignature({ id: enterprise!.enterprise_id, body: values });
            const url = URL.createObjectURL(data);
            setImage(url);
        } catch (error) {
            message.error(`Error al cargar la visualización ${error}`)
        }finally{
            setLoading(false);
        }
    }

    const handleSubmit = (values: FormSignature) => {
        mutate({id: enterprise!.enterprise_id, body: values});
    }

    const getColorHex = (e: Color) => {
        return e?.toHexString();
    };

    return (
        <Modal
            title="Crear Firma"
            open={open}
            width={'100%'}
            okText="Guardar"
            onCancel={onClose}
            onOk={() => form.submit()}
            footer={(_, { OkBtn, CancelBtn }) => (
                <>
                    <Button onClick={hanldePreview} loading={loading} disabled={loading}>Visualizar</Button>
                    <CancelBtn />
                    <OkBtn />
                </>
            )}
        >
            <Row gutter={20} >
                <Col flex='auto'>
                    <Form
                        layout='vertical'
                        form={form}
                        onFinish={handleSubmit}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Logo"
                                    name="url_logo"
                                    rules={[{ required: true, message: 'El logo es obligatorio' }, { type: 'url', message: 'Debe ser una URL valida' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Background"
                                    name="background"
                                    rules={[{ required: true, message: 'El fondo es obligatorio' }, { type: 'url', message: 'Debe ser una URL valida' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Color del texto"
                                    name="color_text"
                                    rules={[{ required: true, message: 'El color de texto es obligatorio' }]}
                                    getValueFromEvent={getColorHex}
                                >
                                    <ColorPicker format='hex' disabledFormat />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Texto primera sección"
                                    name="text_first_section"
                                    rules={[{ required: true, message: 'El texto es obligatorio' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Texto segunda sección"
                                    name="text_second_section"
                                    rules={[{ required: true, message: 'El texto es obligatorio' }]}
                                >
                                    <TextArea autoSize />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Texto tercera sección"
                                    name="text_third_section"
                                    rules={[{ required: true, message: 'El texto es obligatorio' }]}
                                >
                                    <TextArea autoSize />
                                </Form.Item>
                            </Col>

                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Primer color primera sección"
                                    name="first_color_first_section"
                                    getValueFromEvent={getColorHex}
                                >
                                    <ColorPicker format='hex' />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Segundo color primera sección"
                                    name="second_color_first_section"
                                    getValueFromEvent={getColorHex}
                                >
                                    <ColorPicker format='hex' />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Primer color tercera sección"
                                    name="first_color_third_section"
                                    getValueFromEvent={getColorHex}
                                >
                                    <ColorPicker format='hex' />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Segundo color tercera sección"
                                    name="second_color_third_section"
                                    getValueFromEvent={getColorHex}
                                >
                                    <ColorPicker format='hex' />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Texto extra"
                                    name="extra_text"
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Color texto extra"
                                    name="color_extra"
                                    getValueFromEvent={getColorHex}
                                >
                                    <ColorPicker format='hex' />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Texto vertical"
                                    name="vertical_text"
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Color texto vertical"
                                    name="color_vertical_text"
                                    getValueFromEvent={getColorHex}
                                >
                                    <ColorPicker format='hex' />
                                </Form.Item>
                            </Col>
                        </Row>

                    </Form>
                </Col>
                <Col flex='500px'>
                    <Image src={image} />
                </Col>
            </Row>
        </Modal>
    )
}
