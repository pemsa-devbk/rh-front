import {
    Button,
    Form,
    Input,
    Typography,
} from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

import "./LoginForm.css";
import logo from '../../../../assets/logo_pem.png'


interface LoginFormValues {
    user_id: string;
    password: string;
}

interface LoginFormProps {
    loading?: boolean;
    onSubmit: (values: LoginFormValues) => void;
}

export const LoginForm = ({
    loading = false,
    onSubmit,
}: LoginFormProps) => {
    const [form] = Form.useForm<LoginFormValues>();

    const handleFinish = (values: LoginFormValues) => {
        onSubmit(values);
    };

    return (
        <div className="login__form">
            <div className="login__wrapper">
                <div className="login__logo">
                    <img width={130} src={logo} />
                </div>
                <Typography.Title level={2} style={{ textAlign: 'center' }}>Inicio de sesión</Typography.Title>
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={handleFinish}
                >
                    <Form.Item
                        name="user_id"
                        rules={[
                            { len: 5, message: 'El número de empleado consta de 5 digitos' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Número de empleado"
                            variant="underlined"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Ingresa tu contraseña",
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Contraseña"
                            variant="underlined"
                        />
                    </Form.Item>
                    <div className="login__actions">

                        {/* <Button
                            type="link"
                            className="btn__fogot"
                        >
                            ¿Olvidaste tu contraseña?
                        </Button> */}

                        <Button
                            htmlType="submit"
                            type="primary"
                            loading={loading}
                        >
                            Iniciar sesión
                        </Button>

                    </div>
                </Form>
            </div>
        </div>
    );
};