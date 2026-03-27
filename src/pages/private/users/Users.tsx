import { useUsers, useUsersByArea, useUsersByCourse, useUsersByEnterprise, useUsersByOffice, useUsersByPosition } from '../../../hooks/user';
import { useState } from 'react';
import { Button, Col, Flex, Row, Table, Typography } from 'antd';
import { ModalCreate } from './components/ModalCreate';
import { PlusOutlined } from '@ant-design/icons';
import { User } from '../../../api/interfaces/user';
import { GetColumns } from './columns';
import { ModalEdit } from './components/ModalEdit';
import { DrawerListContact } from '../contacts/components/DrawerListContact';
import { DrawerListHolidays } from '../holidays/components/DrawerListHolidays';
import { QueryParams } from '../../../api/interfaces/queryParams';
import { Enterprise } from '../../../api/interfaces/enterprise';
import { Office } from '../../../api/interfaces/office';
import { Area } from '../../../api/interfaces/area';
import { Position } from '../../../api/interfaces/position';
import { Course } from '../../../api/interfaces/course';
import { InputSearch } from '../../../components/InputSearch';

interface Props {
    enterprise?: Enterprise;
    office?: Office;
    area?: Area;
    position?: Position;
    course?: Course;
}
export const Users = ({ enterprise, office, area, position, course }: Props) => {

    const [params, setParams] = useState<QueryParams>({
        skip: 0,
        take: 10,
        search: ''
    });

    const { data, isPending, refetch } = enterprise ? useUsersByEnterprise(enterprise.enterprise_id, params)
        : office ? useUsersByOffice(office.office_id, params)
            : area ? useUsersByArea(area.area_id, params)
                : position ? useUsersByPosition(position.position_id, params)
                    : course ? useUsersByCourse(course.course_id, params)
                        : useUsers(params);

    const [openModal, setOpenModal] = useState({
        create: false,
        edit: false,
        viewContacts: false,
        viewHolidays: false,
    });
    const setStateOpenModal = (type: 'edit' | 'create' | 'viewContacts' | 'viewHolidays') => {
        setOpenModal((old) => ({ ...old, [type]: !old[type] }));
    }

    const [selectedUser, setSelectedUser] = useState<User>();
    const columns = GetColumns({ refetch, setSelectedUser, setStateOpenModal });
    const setSearch = (search: string) => {
        setParams((old) => ({ ...old, search }));
    }

    return (
        <>
            <Flex justify='space-between' align='center' style={{ marginBottom: '1rem' }}>
                <Typography.Title style={{ margin: 0, padding: 0 }}>Empleados</Typography.Title>
                <Button size='large' icon={<PlusOutlined />} type='primary' onClick={() => setStateOpenModal('create')} >Agregar</Button>
            </Flex>
            <Row style={{ marginBottom: '2rem', background: '#fff', padding: '1.5rem 1rem', borderRadius: '10px', boxShadow: '2px 5px 5px #e4e4e4' }} gutter={10}>
                <Col sm={14}>
                    <Flex vertical gap={10}>
                        <Typography.Text strong>¿Qué empleado deseas buscar?</Typography.Text>
                        <InputSearch setSearch={setSearch} />
                    </Flex>
                </Col>
                <Col sm={5}>
                    {/*  */}
                </Col>
                <Col sm={5}>
                    {/*  */}
                </Col>
            </Row>
            

            <ModalCreate enterprise={enterprise} office={office} area={area} position={position} onClose={() => setStateOpenModal('create')}  open={openModal.create} />
            <ModalEdit onClose={() => setStateOpenModal('edit')} open={openModal.edit} user={selectedUser} />
            <DrawerListContact onClose={() => setStateOpenModal('viewContacts')} open={openModal.viewContacts} userID={selectedUser?.user_id} />
            <DrawerListHolidays onClose={() => setStateOpenModal('viewHolidays')} open={openModal.viewHolidays} userID={selectedUser?.user_id} /> 
            <Table<User>
                pagination={{
                    current: (params.skip! / params.take!) + 1, pageSize: params.take, total: data?.total,
                    onChange: (page, pageSize) => setParams((old) => ({ ...old, start: (page - 1) * pageSize, length: pageSize }))
                }}
                columns={columns} dataSource={data?.data} loading={isPending} rowKey='user_id'
            />

        </>

    )
}


