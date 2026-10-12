

import {  Flex, Typography } from "antd";
import { LoginForm } from "./components/LoginForm";
import "./components/LoginForm.css";
import { useAuthStore } from "../../../store/auth/auth.store";
import { useAuth } from "../../../hooks/auth";


export const Login = () => {

    const login = useAuthStore(state => state.login);
    const {mutate, isPending} = useAuth();

    const handleLogin = ({ password, user_id }: { user_id: string; password: string; }) => {
        mutate({user_id, password}, {
            onSuccess({user, token}){
                login(user, token);
            }
        })
    };

    return (
        <Flex justify="center" align="center" className="login" >
            <div className="login__container">
                <div className="login__decoration">
                    <div className="decoration decoration--2">
                        <div className="shape shape--4"></div>
                        <div className="shape shape--3"></div>
                    </div>
                    <div className="decoration decoration--1">
                        <div className="shape shape--2"></div>
                        <div className="shape shape--1"></div>
                    </div>
                    <div className="login__tabs">
                        <span className="top-curve"></span>
                        <Typography.Title className="login__title" level={3} style={{ margin: 0 }} >BIENVENIDO</Typography.Title>
                        <span className="bottom-curve"></span>
                    </div>
                </div>
                <LoginForm onSubmit={handleLogin} loading={isPending} />
                {/* <div className="login__forgot">
                    <Typography.Title>Recupera tu contraseña</Typography.Title>
                </div> */}
            </div>
        </Flex>
    );
}

