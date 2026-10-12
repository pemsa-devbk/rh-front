import { Button, Col, Form, Input, Row, Typography } from 'antd'
import { useUpdatePassword } from '../../../hooks/employee';
import { UpdatePasswordDTO } from '../../../api/interfaces/employee';


export const ChangePassword = () => {
    const [form] = Form.useForm<UpdatePasswordDTO>();
    const { mutate } = useUpdatePassword(() => {
        form.resetFields();
    });

    const handleFormSubmit = (values: UpdatePasswordDTO) => {
        mutate(values);
    }
    return (
        <div>
            <Row>
                <Col xs={1} sm={3} md={5} lg={7} xl={8} xxl={9}></Col>
                <Col xs={22} sm={19} md={14} lg={10} xl={8} xxl={6}>
                    <Typography.Title level={2} style={{ color: '#426feb', textAlign: 'center' }}>Cambiar contraseña</Typography.Title>
                    <Typography.Text>Ingrese la contraseña actual y la nueca contraseña a utilizar en el sistema.</Typography.Text>
                    <br />
                    <br />
                    <Form
                        layout='vertical'
                        form={form}
                        onFinish={handleFormSubmit}
                    >
                        <Form.Item
                            label="Contraseña actual"
                            name="old_password"
                            rules={[{ required: true, message: "La contraseña actual es requerida" }]}
                        >
                            <Input.Password placeholder="input password" />
                        </Form.Item>

                        <Form.Item
                            label="Nueva contraseña"
                            name="password"
                            rules={[{ required: true, message: "La nueva contraseña es requerida" }]}
                        >
                            <Input.Password placeholder="input password" />
                        </Form.Item>

                        <Form.Item
                            label="Confirmar contraseña"
                            name="confirm_password"
                            rules={[{ required: true, message: "La contraseña de cofirmación es requerida" }]}
                        >
                            <Input.Password placeholder="input password" />
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType='submit' type='primary'>Cambiar contraseña</Button>
                        </Form.Item>
                    </Form>
                </Col>
                <Col xs={1} sm={3} md={5} lg={7} xl={8} xxl={6}></Col>
            </Row>

        </div>
        // <Flex justify='center' align='center' style={{height: '100%'}}>
        // </Flex>
    )
}
