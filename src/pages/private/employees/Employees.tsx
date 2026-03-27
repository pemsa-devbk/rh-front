import { useState } from 'react'
import { QueryParams } from '../../../api/interfaces/queryParams';
import { useEmployees, useEmployeesByArea, useEmployeesByCourse, useEmployeesByDepartment, useEmployeesByEnterprise, useEmployeesByOffice, useEmployeesByPosition } from '../../../hooks/employee';
import { useModals } from '../../../hooks/useModals';
import { Employee } from '../../../api/interfaces/employee';
import { Button, Col, Flex, Row, Table, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { InputSearch } from '../../../components/InputSearch';
import { EmployeeContext, useColumns } from './hook/useColumns';
import { NavLink } from 'react-router-dom';
import { Enterprise } from '../../../api/interfaces/enterprise';
import { Office } from '../../../api/interfaces/office';
import { Department } from '../../../api/interfaces/department';
import { Area } from '../../../api/interfaces/area';
import { Position } from '../../../api/interfaces/position';
import { Course } from '../../../api/interfaces/course';

interface Props {
    enterprise?: Enterprise;
    office?: Office;
    department?: Department;
    area?: Area;
    position?: Position;
    course?: Course;
    context?: EmployeeContext;
}
const MODAL_KEYS = ['edit'];
type ModalKeys = typeof MODAL_KEYS[number];

export const Employees = ({ enterprise, office, department, area, position, course, context = EmployeeContext.FROM_GENERAL }: Props) => {

    const [params, setParams] = useState<QueryParams>({
        skip: 0,
        take: 10,
        search: ''
    });

    const { data, isPending } = enterprise ? useEmployeesByEnterprise(enterprise.enterprise_id, params)
        : office ? useEmployeesByOffice(office.office_id, params)
            : department ? useEmployeesByDepartment(department.department_id, params)
                : area ? useEmployeesByArea(area.area_id, params)
                    : position ? useEmployeesByPosition(position.position_id, params)
                        : course ? useEmployeesByCourse(course.course_id, params)
                            : useEmployees(params);

    const { openModal, closeModal, isOpen, toggleModal } = useModals<ModalKeys>(MODAL_KEYS);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee>();
    const columns = useColumns({ setSelectedEmployee, toggleModal, context });

    const setSearch = (search: string) => {
        setParams((old) => ({ ...old, search }));
    }


    return (
        <>
            <Flex justify='space-between' align='center' style={{ marginBottom: '1rem' }}>
                <Typography.Title style={{ margin: 0, padding: 0 }}>Empleados</Typography.Title>
                <NavLink to='/dashboard/employees/create'>
                    <Button size='large' icon={<PlusOutlined />} type='primary'>Agregar empleado</Button>
                </NavLink>
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

            <Table<Employee>
                pagination={{
                    current: (params.skip! / params.take!) + 1, pageSize: params.take, total: data?.total,
                    onChange: (page, pageSize) => setParams((old) => ({ ...old, start: (page - 1) * pageSize, length: pageSize }))
                }}
                columns={columns} dataSource={data?.data} loading={isPending} rowKey='user_id'
            />
            
        </>
    )
}
