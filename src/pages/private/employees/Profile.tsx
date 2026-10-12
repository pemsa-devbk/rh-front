import { useMeProfile } from '../../../hooks/employee';
import { useModals } from '../../../hooks/useModals';
import { Badge, Col, Flex, Image, Result, Row, Skeleton, Tabs, Typography } from 'antd';
import { InfoEnterprise } from '../enterprise-info/components/InfoEnterprise';
import { InfoMedical } from '../medical/components/InfoMedical';
import { InfoBanking } from '../bank/components/InfoBanking';
import { InfoLicense } from '../license/components/InfoLicense';
import { InfoAddress } from '../address/components/InfoAddress';
import { InfoEmployee } from './components/InfoEmployee';
import { InfoBasic } from './components/InfoBasic';
import { TabContracts } from '../contract/components/TabContracts';
import { TabBinnacle } from './components/TabBinnacle';
import { TabContacts } from '../contacts/components/TabContacts';
import { TabCourses } from '../courses/componets/TabCourses';
import { TabHoliday } from '../holidays/components/TabHoliday';
import { TabFiles } from '../files/componets/TabFiles';
import { StatusUser } from '../../../api/interfaces/user';
import { base_url } from '../../../api/rh';
import { fallbackImage } from '../../../helpers/fallback-img';
import { DrawerHandle as DrawerHandleMedical } from '../medical/components/DrawerHandle';
import { DrawerEdit as DrawerHandleAddress } from '../address/components/DrawerEdit';
import { DrawerHandle as DrawerHandleBanking } from '../bank/components/DrawerHandle';
import { DrawerHandle as DrawerHandleLicense } from '../license/components/DrawerHandle';
import { DrawerEdit as DrawerEditEnterpriseInfo } from '../enterprise-info/components/DrawerEdit';
import { DrawerEditBasic } from './components/DrawerEditBasic';
import { DrawerEditPosition } from './components/DrawerEditPosition';


const MODAL_KEYS = ['handle-address', 'edit-employee-basic', 'edit-employee-position', 'handle-medical', 'handle-banking', 'handle-license', 'edit-enterprise-info', 'create-contact'];
type ModalKeys = typeof MODAL_KEYS[number];

export const Profile = () => {
    const { data, error, isLoading } = useMeProfile();

    const { openModal, closeModal, isOpen } = useModals<ModalKeys>(MODAL_KEYS);

    if (isLoading)
        return <Skeleton loading={isLoading} />
    if (error)
        return <Result
            //@ts-ignore
            status={error.status}
            title='Ocurrio un error'
            subTitle={error.message}
        />

    if (!data)
        return <Result
            status="404"
            title="404"
            subTitle="No hay datos a mostrar."
        />

    return (
        <div>
            <DrawerEditBasic open={isOpen('edit-employee-basic')} onClose={closeModal} modalKey='edit-employee-basic' employee={data} />
            <DrawerEditPosition open={isOpen('edit-employee-position')} onClose={closeModal} modalKey='edit-employee-position' employee={data} />
            <DrawerHandleMedical open={isOpen('handle-medical')} employee={data} onClose={closeModal} modalKey='handle-medical' />
            <DrawerHandleAddress open={isOpen('handle-address')} employee={data} onClose={closeModal} modalKey='handle-address' />
            <DrawerHandleBanking open={isOpen('handle-banking')} employee={data} onClose={closeModal} modalKey='handle-banking' />
            <DrawerHandleLicense open={isOpen('handle-license')} employee={data} onClose={closeModal} modalKey='handle-license' />
            <DrawerEditEnterpriseInfo open={isOpen('edit-enterprise-info')} employee={data} onClose={closeModal} modalKey='edit-enterprise-info' />

            <Row gutter={[16, 16]}>
                <Col span={14}>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <div style={{ background: '#fff', padding: 20 }}>
                                <Flex align='center' justify='space-between'>
                                    <div>
                                        <Flex gap={15} align='center'>
                                            <Image src={`${base_url}employees/${data.user_id}/profile`} fallback={fallbackImage} width={60} />
                                            <div>
                                                <Typography.Title level={5} style={{ margin: 0 }}>{data?.name}</Typography.Title>
                                                <Typography.Text>Area: {data?.area_name} | </Typography.Text>
                                                <Typography.Text type='secondary'>{data?.position_name}</Typography.Text>
                                            </div>
                                        </Flex>
                                    </div>
                                    {
                                        (data?.status === StatusUser.activo) ? <Badge status='processing' color='green' text='Activo' /> : (data?.status === StatusUser.baja) ? <Badge status='processing' color='red' text='Baja' /> : <Badge status='processing' color='cyan' text='Vacaciones' />
                                    }
                                    {/* TODO Botones para actualizar foto y firma */}
                                    {/* <Tooltip title='Actualizar Foto'>
                                        <Button type='text' icon={<FileImageOutlined />}></Button>
                                    </Tooltip> */}

                                </Flex>
                                {/* <Divider />
                                <Descriptions
                                    size='small'
                                    layout='vertical'
                                    column={4}
                                    items={[
                                        { label: 'Oficina', children: `${data?.office_name}` },
                                        { label: 'Jefe directo', children: `${data?.boss_id}` },
                                        { label: 'Fecha de ingreso', children: dayjs(data?.date_entry).format('DD [de] MMMM [de] YYYY') },
                                        { label: 'Estatus', children: (data?.status === StatusUser.activo) ? <Badge status='processing' color='green' text='Activo' /> : (data?.status === StatusUser.baja) ? <Badge status='processing' color='red' text='Baja' /> : <Badge status='processing' color='cyan' text='Vacaciones' /> },
                                    ]}
                                /> */}
                            </div>
                        </Col>
                        <Col span={24}>

                            <div style={{ background: '#fff', padding: 20 }}>
                                <Tabs
                                    size='small'
                                    items={[
                                        {
                                            label: 'Datos del empleado', key: '1',
                                            children: <div>
                                                <InfoBasic employeeID={data.user_id} openModal={ openModal} modalkey='edit-employee-basic' />
                                                <br />
                                                <InfoEmployee employeeID={data.user_id} openModal={ openModal} modalKey='edit-employee-position' />
                                                <br />
                                                <InfoAddress employeeID={data.user_id} openModal={ openModal} modalKey='handle-address' />
                                            </div>
                                        },
                                        { label: 'Contratos', key: '2', children: <TabContracts employeeID={data.user_id}  /> },
                                        { label: 'Movimientos', key: '3', children: <TabBinnacle employeeID={data.user_id} /> },
                                        { label: 'Contactos', key: '4', children: <TabContacts employeeID={data.user_id}  /> },
                                        { label: 'Cursos', key: '5', children: <TabCourses employeeID={data.user_id} /> },
                                        { label: 'Vacaciones', key: '6', children: <TabHoliday employeeID={data.user_id} /> },
                                        { label: 'Archivos', key: '7', children: <TabFiles employeeID={data.user_id} /> },
                                    ]}
                                />
                            </div>
                        </Col>
                    </Row>

                </Col>
                <Col span={10}>
                    <Flex vertical gap={16}>
                        <div style={{ background: '#fff', padding: 20 }}>
                            <InfoEnterprise employeeID={data.user_id} openModal={() => openModal('edit-enterprise-info')} employee={data} />
                        </div>
                        <div style={{ background: '#fff', padding: 20 }}>
                            <InfoMedical employeeID={data.user_id} openModal={() => openModal('handle-medical')} />
                        </div>
                        <div style={{ background: '#fff', padding: 20 }}>
                            <InfoBanking employeeID={data.user_id} openModal={() => openModal('handle-banking')} />
                        </div>
                        <div style={{ background: '#fff', padding: 20 }}>
                            <InfoLicense employeeID={data.user_id} openModal={() => openModal('handle-license')}  />
                        </div>
                    </Flex>
                </Col>
            </Row>
        </div>
    )
}
