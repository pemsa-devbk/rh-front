import { useAuthStore } from "../store/auth/auth.store";
import { Avatar, Dropdown, Flex, Image, Layout, MenuProps, theme } from "antd";
import { base_url } from "../api/rh";
import { fallbackImage } from "../helpers/fallback-img";
import { useNavigate } from "react-router-dom";



export default function Header() {
  const user = useAuthStore(state => state.user);
  const logOuth = useAuthStore(state => state.logOut);
  const navigate = useNavigate();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: 'Mi cuenta',
      disabled: true
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      label: 'Perfil',
      onClick: () => navigate(`me`)
    },
    {
      key: '3',
      label: 'Cambiar contraseña',
      onClick: () => navigate(`change-password`)
    },
    {
      key: '4',
      label: 'Cerrar sesión',
      danger: true,
      onClick: logOuth
    },
  ];

  return (
    <Layout.Header style={{ padding: 0, background: colorBgContainer }} >
      <Flex justify="space-between" align="center" style={{ height: '100%', padding: 10 }}>
        <div>

        </div>
        <Flex align="center" gap={5} style={{ padding: '0 1rem' }}>
          <Dropdown menu={{ items }}>
            <Avatar src={<Image preview={false} src={`${base_url}employees/${user?.user_id}/profile`} fallback={fallbackImage} />}></Avatar>
          </Dropdown>
          <p>{user?.name.split(' ')[0]}</p>
        </Flex>
      </Flex>
    </Layout.Header>
  );
}
