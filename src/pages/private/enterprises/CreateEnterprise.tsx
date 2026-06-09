import { Button, Col, ColorPicker, Flex, Form, Image, Input, message, Row } from 'antd'
import { Color } from 'antd/es/color-picker';
import { useState } from 'react';
import { FormEnterprise } from '../../../api/interfaces/enterprise';
import { priviewSignature } from '../../../api/enterprise';
import { useCreateEnterpise } from '../../../hooks/enterprise';
import { fallbackImage } from '../../../helpers/fallback-img';
import { useNavigate } from 'react-router-dom';

export const CreateEnterprise = () => {
	const navigate = useNavigate();
	const [image, setImage] = useState<string>();
	const [loading, setLoading] = useState(false);
	const [form] = Form.useForm<FormEnterprise>();
	const { mutate, isPending } = useCreateEnterpise( () => {
		navigate('/dashboard/enterprises');
	});
	
	
	const hanldePreview = async () => {
		await form.validateFields();
		const isValid = form.isFieldsValidating();
		if(!isValid) return;
		setLoading(true);
		const values = form.getFieldsValue();
		try {
			const data = await priviewSignature(values);
			const url = URL.createObjectURL(data);
			setImage(url);
		} catch (error) {
			message.error(`Error al cargar la visualización ${error}`)
		} finally {
			setLoading(false);
		}
	}

	const handleSubmit = (values: FormEnterprise) => {
		const { name, address, ...signature } = values;
		mutate({ name, address, signature });
	}

	const getColorHex = (e: Color) => {
		return e?.toHexString();
	};

	return (
		<div>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<div style={{ textAlign: 'center' }}>
						{
							image
								?
								<Image src={image} width={450} />
								:
								<Image src={fallbackImage} />
						}
					</div>
				</Col>
				<Col span={24}>
					<div style={{ background: 'white', padding: 10 }}>
						<Form
							layout='vertical'
							form={form}
							onFinish={handleSubmit}
						>
							<Row gutter={16}>
								<Col span={8}>
									<Form.Item
										label="Nombre"
										name="name"
										rules={[{ required: true, message: "El nombre es requerido" }]}
									>
										<Input />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item
										label="Dirección"
										name="address"
										rules={[{ required: true, message: "La dirección es requerida" }]}
									>
										<Input />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item
										label="Logo"
										name="url_logo"
										rules={[{ required: true, message: 'El logo es obligatorio' }, { type: 'url', message: 'Debe ser una URL valida' }]}
									>
										<Input />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item
										label="Fondo"
										name="background"
										rules={[{ required: true, message: 'El fondo es obligatorio' }, { type: 'url', message: 'Debe ser una URL valida' }]}
									>
										<Input />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item
										label="Texto primera sección"
										name="text_first_section"
										rules={[{ required: true, message: 'El texto es obligatorio' }]}
									>
										<Input />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item
										label="Texto segunda sección"
										name="text_second_section"
										rules={[{ required: true, message: 'El texto es obligatorio' }]}
									>
										<Input />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item
										label="Texto tercera sección"
										name="text_third_section"
										rules={[{ required: true, message: 'El texto es obligatorio' }]}
									>
										<Input />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item
										label="Texto extra"
										name="extra_text"
									>
										<Input />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item
										label="Texto vertical"
										name="vertical_text"
									>
										<Input />
									</Form.Item>
								</Col>

								<Col span={6}>
									<Form.Item
										label="Color del texto"
										name="color_text"
										rules={[{ required: true, message: 'El color de texto es obligatorio' }]}
										getValueFromEvent={getColorHex}
									>
										<ColorPicker format='hex' showText />
									</Form.Item>
								</Col>
								<Col span={6}>
									<Form.Item
										label="Primer color primera sección"
										name="first_color_first_section"
										getValueFromEvent={getColorHex}
									>
										<ColorPicker format='hex' showText />
									</Form.Item>
								</Col>
								<Col span={6}>
									<Form.Item
										label="Segundo color primera sección"
										name="second_color_first_section"
										getValueFromEvent={getColorHex}
									>
										<ColorPicker format='hex' showText />
									</Form.Item>
								</Col>
								<Col span={6}>
									<Form.Item
										label="Primer color tercera sección"
										name="first_color_third_section"
										getValueFromEvent={getColorHex}
									>
										<ColorPicker format='hex' />
									</Form.Item>
								</Col>
								<Col span={6}>
									<Form.Item
										label="Segundo color tercera sección"
										name="second_color_third_section"
										getValueFromEvent={getColorHex}
									>
										<ColorPicker format='hex' />
									</Form.Item>
								</Col>
								<Col span={6}>
									<Form.Item
										label="Color texto extra"
										name="color_extra"
										getValueFromEvent={getColorHex}
									>
										<ColorPicker format='hex' />
									</Form.Item>
								</Col>
								<Col span={6}>
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
					</div>
				</Col>
			</Row>
			<Row align='middle'>
				<Col span={24}>
					<Flex justify='flex-end'>
						<Button variant='text' disabled={loading} loading={loading} onClick={hanldePreview}>Visualizar firma</Button>
						<Button variant='text' loading={isPending} disabled={isPending} onClick={() => form.submit()}>Guardar</Button>
					</Flex>
				</Col>
			</Row>
		</div>
	)
}
