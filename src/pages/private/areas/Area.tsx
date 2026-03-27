import { useArea } from '../../../hooks/area';
import { useParams } from 'react-router-dom';
import { Col, Descriptions, Result, Row, Skeleton, Tabs } from 'antd';
import { Positions } from '../position/Positions';
import { Employees } from '../employees/Employees';
import { PositionQueryContext } from '../position/hooks/useColumns';
import { EmployeeContext } from '../employees/hook/useColumns';

export const Area = () => {
    const { areaID = '', departmentID = '' } = useParams();
    const { data, isLoading, isError, error } = useArea(+departmentID, +areaID);

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
                            { key: 'department', label: 'Departamento', children: data?.department_name },
                            { key: 'area', label: 'Area', children: data?.name },
                            { key: 'responsible', label: 'Responsable', children: data?.responsible_name || 'No hay responsable asignado' },
                            { key: 'positions', label: 'Puestos', children: data?.total_positions },
                            { key: 'users', label: 'Empleados', children: data?.total_employees },
                        ]}
                    />
                </Col>
            </Row>
            <Tabs
                style={{ marginTop: '2rem' }}
                items={[
                    { key: 'positions', label: 'Puestos', children: <Positions area={data} context={PositionQueryContext.FROM_AREA} /> },
                    { key: 'users', label: 'Empelados', children: <Employees area={data} context={EmployeeContext.FROM_AREA} /> },
                ]}
            />
        </>
    )
}
