import { useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth/auth.store";
import { Avatar, Button, Flex, Layout, theme } from "antd";
import { ExclamationCircleTwoTone } from "@ant-design/icons";

export default function Header() {
    const params = useLocation();
    const user = useAuthStore(state => state.user);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout.Header style={{ padding: 0, background: colorBgContainer }} >
            <Flex justify="space-between">
                <div>
                    <h2>{
                        params.pathname.includes('usuarios')
                            ? 'Gestion de usuarios'
                            : params.pathname.includes('registro')
                                ? 'Creación de usuario usuario'
                                :
                                params.pathname.includes('editarUsuario')
                                    ? 'Edición de usuario'
                                    :
                                    params.pathname.includes('mostar')
                                        ? 'Información de usuario'
                                        :
                                        params.pathname.includes('contacto')
                                            ?
                                            'Contactos'
                                            :
                                            'Pagina de incio'
                    }
                    </h2>
                </div>
                <Flex align="center" gap={5} style={{padding: '0 1rem'}}>
                    <Avatar>{user?.name.charAt(0)}</Avatar>
                    <p>{user?.name}</p>
                    <Button  danger icon={<ExclamationCircleTwoTone twoToneColor={'#f00'} />} />
                </Flex>
            </Flex>

        </Layout.Header>
    );
}
