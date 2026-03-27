import { useParams } from 'react-router-dom';
import { useOffice } from '../../../hooks/office';
import { Col, Descriptions, Result, Row, Skeleton, Tabs } from 'antd';
import { Areas } from '../areas/Areas';
import { Positions } from '../position/Positions';
import { Employees } from '../employees/Employees';
import { EmployeeContext } from '../employees/hook/useColumns';
import { Departments } from '../departments/Departments';
import { DepartmentQueryContext } from '../departments/hook/useColumns';
import { AreaQueryContext } from '../areas/hooks/useColumns';
import { PositionQueryContext } from '../position/hooks/useColumns';

export const Office = () => {
    const { enterpriseID = '', officeID = '' } = useParams();
    const { data, isLoading, isError, error } = useOffice(enterpriseID, +officeID);

    if (isLoading)
        return <Skeleton avatar paragraph={{ rows: 4 }} />;

    if (isError) return <Result
        //@ts-ignore
        status={`${error?.status || '500'}`}
        title="404"
        subTitle={`${error.message}`}
    />
    return (
        <>
            <Row align='middle' style={{ background: '#fff', padding: '1.5rem', borderRadius: '10px' }} gutter={[10, 10]}>
                <Col span={24}>
                    <Descriptions
                        items={[
                            { key: 'enterprise', label: 'Empresa', children: data?.enterprise_name },
                            { key: 'office', label: 'Oficina', children: data?.name },
                            { key: 'departments', label: 'Departamentos', children: data?.total_departments },
                            { key: 'areas', label: 'Areas', children: data?.total_areas },
                            { key: 'positions', label: 'Puestos', children: data?.total_positions },
                            { key: 'employees', label: 'Empleados', children: data?.total_employees },
                        ]}
                    />
                </Col>
            </Row>
            <Tabs
                style={{ marginTop: '2rem' }}
                items={[
                    { key: 'departments', label: 'Departamentos', children: <Departments office={data} context={DepartmentQueryContext.FROM_OFFICE} /> },
                    { key: 'areas', label: 'Areas', children: <Areas office={data} context={AreaQueryContext.FROM_OFFICE} /> },
                    { key: 'positions', label: 'Puestos', children: <Positions office={data} context={PositionQueryContext.FROM_OFFICE} /> },
                    { key: 'users', label: 'Empelados', children: <Employees office={data} context={EmployeeContext.FROM_OFFICE} /> },
                ]}
            />
        </>
    )
}
