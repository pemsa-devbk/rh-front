import { useParams } from 'react-router-dom';
import { Col, Descriptions, Result, Row, Skeleton, Tabs } from 'antd';
import { Areas } from '../areas/Areas';
import { Positions } from '../position/Positions';
import { Employees } from '../employees/Employees';
import { EmployeeContext } from '../employees/hook/useColumns';
import { useDepartment } from '../../../hooks/department';
import { AreaQueryContext } from '../areas/hooks/useColumns';
import { PositionQueryContext } from '../position/hooks/useColumns';

export const Department = () => {
    const { officeID = '', departmentID = '' } = useParams();
    const { data, isLoading, isError, error } = useDepartment(+officeID, +departmentID);

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
                            { key: 'office', label: 'Oficina', children: data?.office_name },
                            { key: 'department', label: 'Departamento', children: data?.name },
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
                    { key: 'areas', label: 'Areas', children: <Areas department={data} context={AreaQueryContext.FROM_DEPARTMENT} /> },
                    { key: 'positions', label: 'Puestos', children: <Positions department={data} context={PositionQueryContext.FROM_DEPARTMENT} /> },
                    { key: 'users', label: 'Empelados', children: <Employees  context={EmployeeContext.FROM_DEPARTMENT} /> },
                ]}
            />
        </>
    )
}
