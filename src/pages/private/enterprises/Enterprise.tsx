import { Avatar, Col, Descriptions, Result, Row, Skeleton, Space, Tabs } from 'antd'
import { useEnterprise } from '../../../hooks/enterprise'
import { useParams } from 'react-router-dom'
import { Offices } from '../offices/Offices';
import { Areas } from '../areas/Areas';
import { Positions } from '../position/Positions';
import { OfficeQueryContext } from '../offices/hooks/useColumns';
import { Departments } from '../departments/Departments';
import { DepartmentQueryContext } from '../departments/hook/useColumns';
import { Employees } from '../employees/Employees';
import { EmployeeContext } from '../employees/hook/useColumns';
import { AreaQueryContext } from '../areas/hooks/useColumns';
import { PositionQueryContext } from '../position/hooks/useColumns';

export const Enterprise = () => {
  const { id = '' } = useParams();
  const { data, isLoading, isError, error } = useEnterprise(id);

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
        <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 10 }}>
          <Space>
            <Avatar style={{ backgroundColor: 'red', verticalAlign: 'middle' }} size="large" gap={2}>
              {data?.name.charAt(0)}
            </Avatar>
            <Descriptions
              column={1}
              items={[
                { key: 'name', label: 'Nombre', children: data?.name, },
                { key: 'dir', label: 'Dirección', children: data?.address },
              ]}
            />
          </Space>
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 14 }}>
          <Descriptions
            column={{
              lg: 3,
              xs: 1, sm: 1, md: 2
            }}
            title="Información de la empresa"
            items={[
              { key: 'offices', label: 'Número de oficinas', children: data?.total_offices },
              { key: 'departments', label: 'Número de departamentos', children: data?.total_departments },
              { key: 'areas', label: 'Número de areas', children: data?.total_areas },
              { key: 'positions', label: 'Número de puestos', children: data?.total_positions },
              { key: 'employees', label: 'Número de empleados', children: data?.total_employees },
            ]}
          />
        </Col>
      </Row>

      <Tabs
        style={{ marginTop: '2rem' }}
        items={[
          { key: 'offices', label: 'Oficinas', children: <Offices enterprise={data} context={OfficeQueryContext.FROM_ENTERPRISE} /> },
          { key: 'departments', label: 'Departamentos', children: <Departments enterprise={data} context={DepartmentQueryContext.FROM_ENTERPRISE} /> },
          { key: 'areas', label: 'Areas', children: <Areas enterprise={data} context={AreaQueryContext.FROM_ENTERPRISE} /> },
          { key: 'positions', label: 'Puestos', children: <Positions enterprise={data} context={PositionQueryContext.FROM_ENTERPRISE} /> },
          { key: 'employees', label: 'Empleados', children: <Employees enterprise={data} context={EmployeeContext.FROM_ENTERPRISE} /> },
        ]}
      />
    </>
  )
}
