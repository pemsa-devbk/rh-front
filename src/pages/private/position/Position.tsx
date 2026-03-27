import React from 'react'
import { useParams } from 'react-router-dom';
import { usePosition } from '../../../hooks/position';
import { Col, Descriptions, Result, Row, Skeleton, Tabs } from 'antd';
import { Users } from '../users/Users';
import { Employees } from '../employees/Employees';
import { EmployeeContext } from '../employees/hook/useColumns';

export const Position = () => {
    const { areaID = '', positionID = '' } = useParams();
    const { data, isLoading, isError, error } = usePosition(+areaID, +positionID);

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
                            { key: 'area', label: 'Area', children: data?.area_name },
                            { key: 'position', label: 'Puesto', children: data?.name },
                            { key: 'users', label: 'Empleados', children: data?.total_employees },
                        ]}
                    />
                </Col>
            </Row>
            <Tabs
                style={{ marginTop: '2rem' }}
                items={[
                    { key: 'users', label: 'Empelados', children: <Employees position={data} context={EmployeeContext.FROM_POSITION} /> },
                ]}
            />
        </>
    )
}
