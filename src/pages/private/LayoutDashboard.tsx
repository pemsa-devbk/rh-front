import { Outlet, useNavigate } from "react-router-dom"
import logo from '../../img/logo_pem.png';
import Header from "../../components/Header"
import { Layout, Menu, MenuProps } from "antd"
import Sider from "antd/es/layout/Sider"
import { ApartmentOutlined, BookOutlined,  HomeOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons"
import { useState } from "react";

type MenuItem = Required<MenuProps>['items'][number];

export const LayoutDashboard = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);


  // const siderStyle: React.CSSProperties = {
  //   overflow: 'auto',
  //   height: '100vh',
  //   position: 'sticky',
  //   insetInlineStart: 0,
  //   top: 0,
  //   bottom: 0,
  //   scrollbarWidth: 'thin',
  //   scrollbarGutter: 'stable',
  // };

  const menuItems: MenuItem[] = [
    {
      label: 'Inicio',
      key: 'home',
      icon: <HomeOutlined />,
      onClick: () => navigate("home")
    },
    {
      label: 'Empleados',
      key: 'employees',
      icon: <UserOutlined />,
      onClick: () => navigate("employees")
    },
    {
      label: 'Entidades',
      key: 'entities',
      icon: <ApartmentOutlined />,
      children: [
        {
          label: 'Empresas',
          key: 'enterprices',
          onClick: () => navigate('enterprises')
        },
        {
          label: 'Oficinas',
          key: 'offices',
          onClick: () => navigate('offices')
        },
        {
          label: 'Departamentos',
          key: 'departments',
          onClick: () => navigate('departments')
        },
        {
          label: 'Areas',
          key: 'areas',
          onClick: () => navigate('areas')
        },
        {
          label: 'Puestos',
          key: 'positions',
          onClick: () => navigate('positions')
        },
      ]
    },


    {
      label: 'Cursos',
      key: 'courses',
      icon: <BookOutlined />,
      onClick: () => navigate('courses')
    },
    {
      label: 'Configuración',
      key: 'config',
      icon: <SettingOutlined />,
      children: [
        {
          label: 'Días de vacaciones',
          key: 'config_days_holiday',
          onClick: () => navigate('config-holiday')
        },
        {
          label: 'Usuarios especiales',
          key: 'config_special_users',
          onClick: () => navigate('special-users')
        }
      ]
    }
  ];


  return (
    <Layout >
      <Sider theme="light" collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} >
        <figure className="nav__picture">
          <img className="nav__logo" src={logo} alt="logo" />
        </figure>
        <Menu mode="inline" theme="light" items={menuItems} />
      </Sider>
      <Layout style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'auto' }}>
        <Header />
        <Layout.Content style={{ margin: '24px 16px 0', overflow: 'initial', flex: 1 }}>
          <div
            style={{
              padding: 10,
              height: '100%',
              maxHeight: '100%',
              overflow: 'auto',
              // minHeight: 360,
              //background: 'red', // TODO: Cambiar para que se pueda ocupar en distintas secciones
              //borderRadius: borderRadiusLG,
            }}>
            <Outlet />
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  )
}
