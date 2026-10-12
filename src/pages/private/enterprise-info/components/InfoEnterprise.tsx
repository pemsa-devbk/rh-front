import { EditOutlined } from '@ant-design/icons';
import { Employee } from '../../../../api/interfaces/employee';
import { useEnterpriseInformationByEmployee } from '../../../../hooks/enterpriseInformation';
import { Alert, Button, Descriptions, Skeleton, Typography } from 'antd';

interface Props {
    employeeID: string;
    openModal: () => void;
    employee: Employee;
}

export const InfoEnterprise = ({ employeeID, openModal }: Props) => {
    const { data, error, isFetching } = useEnterpriseInformationByEmployee(employeeID);

    if (isFetching)
        return <Skeleton loading={isFetching} />

    if (error)
        return <>
            <Typography.Title level={5}>Datos empresariales</Typography.Title>
            <Alert type='error' message='Error al obtener información empresarial del empleado' />
        </>;
    return (
        <Descriptions
            title='Datos empresariales'
            size='small'
            column={3}
            layout='vertical'
            extra={<Button type='text' onClick={openModal} icon={<EditOutlined />} />}
            items={[
                
                { label: 'Correo', children: data?.email },
                { label: 'Celular', children: data?.cell_phone },
                { label: 'Telefono', children: data?.phone },
                { label: 'Ext', children: data?.ext },
            ]}
        />
    )
}
