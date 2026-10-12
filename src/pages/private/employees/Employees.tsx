import { useState } from 'react'
import { QueryParams } from '../../../api/interfaces/queryParams';
import { useEmployees, useEmployeesByArea, useEmployeesByCourse, useEmployeesByDepartment, useEmployeesByEnterprise, useEmployeesByOffice, useEmployeesByPosition } from '../../../hooks/employee';
import { Employee } from '../../../api/interfaces/employee';
import { Button, Flex, Table, Typography } from 'antd';
import { ClearOutlined, PlusOutlined } from '@ant-design/icons';
import { EmployeeContext, useColumns } from './hook/useColumns';
import { NavLink } from 'react-router-dom';
import { Enterprise } from '../../../api/interfaces/enterprise';
import { Office } from '../../../api/interfaces/office';
import { Department } from '../../../api/interfaces/department';
import { Area } from '../../../api/interfaces/area';
import { Position } from '../../../api/interfaces/position';
import { Course } from '../../../api/interfaces/course';
import { ManageColumns } from '../../../components/ManageColumns';
import { useManageColumns } from '../../../hooks/useManageColumns';
import { handleTableChange } from '../../../helpers/handleTableChange';
import { useColumnsEmployee } from '../../../store/tables/employee.store';

interface Props {
    enterprise?: Enterprise;
    office?: Office;
    department?: Department;
    area?: Area;
    position?: Position;
    course?: Course;
    context?: EmployeeContext;
}


export const Employees = ({ enterprise, office, department, area, position, course, context = EmployeeContext.FROM_GENERAL }: Props) => {

    const [params, setParams] = useState<QueryParams>({
        skip: 0,
        take: 10,
    });

    const oldColumns = useColumns({ context });

    const {
        columns,
        checkedList,
        setCheckedList,
        options,
        resetColumns,
    } = useManageColumns<Employee>(
        oldColumns,
        useColumnsEmployee,
    );

    const { data, isPending } = enterprise ? useEmployeesByEnterprise(enterprise.enterprise_id, params)
        : office ? useEmployeesByOffice(office.office_id, params)
            : department ? useEmployeesByDepartment(department.department_id, params)
                : area ? useEmployeesByArea(area.area_id, params)
                    : position ? useEmployeesByPosition(position.position_id, params)
                        : course ? useEmployeesByCourse(course.course_id, params)
                            : useEmployees(params);

    return (
        <>
            <Flex justify='space-between' align='center' style={{ marginBottom: '1rem' }}>
                <Typography.Title style={{ margin: 0, padding: 0 }}>Empleados</Typography.Title>
                {/* <NavLink to='/dashboard/employees/create'>
                    <Button size='large' icon={<PlusOutlined />} type='primary'>Agregar empleado</Button>
                </NavLink> */}
            </Flex>
            {/* <Row style={{ marginBottom: '2rem', background: '#fff', padding: '1.5rem 1rem', borderRadius: '10px', boxShadow: '2px 5px 5px #e4e4e4' }} gutter={10}>
                <Col sm={14}>
                    <Flex vertical gap={10}>
                    </Flex>
                </Col>
                <Col sm={5}>
                    
                </Col>
                <Col sm={5}>
                </Col>
            </Row> */}
            <Flex justify='end' gap={15} style={{ marginBottom: 10 }}>
                <NavLink to='/dashboard/employees/create'>
                    <Button icon={<PlusOutlined />} type='primary'>Crear</Button>
                </NavLink>
                <ManageColumns<Employee> checkedList={checkedList} onChange={setCheckedList} options={options} />
                <Button onClick={resetColumns} icon={<ClearOutlined />}>Limpiar columnas</Button>
            </Flex>

            <Table<Employee>
                scroll={{ x: 'max-content' }}
                // pagination={{
                //     current: (params.skip! / params.take!) + 1, pageSize: params.take, total: data?.total,
                //     // onChange: (page, pageSize) => setParams((old) => ({ ...old, start: (page - 1) * pageSize, length: pageSize }))
                // }}
                onChange={(pagination, filters, sorter) => {
                    handleTableChange({ filters, pagination, setParams, sorter });
                }}
                pagination={{
                    total: data?.total
                }}
                columns={columns} dataSource={data?.data} loading={isPending} rowKey='user_id'
                showSorterTooltip={{ target: 'sorter-icon' }}
            />

        </>
    )
}
