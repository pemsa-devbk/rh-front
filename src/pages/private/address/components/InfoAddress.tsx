import { useAddressByEmployee } from '../../../../hooks/address';
import { Alert, Button, Descriptions, Skeleton, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';

interface Props {
    employeeID: string;
    openModal: (key: string) => void;
    modalKey: string;
}
export const InfoAddress = ({ employeeID, openModal, modalKey }: Props) => {
    const { data, error, isFetching } = useAddressByEmployee(employeeID);

    if (isFetching)
        return <Skeleton loading={isFetching} />
    
    if (error)
        return <>
            <Typography.Title level={5}>Domicilio</Typography.Title>
            <Button type='text' onClick={() => openModal(modalKey)} icon={<EditOutlined />} />
            <Alert type='error' message='Error al obtener información de dirección del empleado' />
        </>;

    return (
        <Descriptions
            size='small'
            column={3}
            layout='vertical'
            title='Domicilio'
            extra={<Button type='text' onClick={() => openModal(modalKey)} icon={<EditOutlined />} />}
            items={[
                { label: 'Estado', children: data?.state_name },
                { label: 'Municipio', children: data?.municipality_name },
                { label: 'Colonia', children: data?.colony_name },
                { label: 'Tipo de asentamiento', children: data?.settlement_name },
                { label: 'Codigo postal', children: data?.postal_code },
                { label: 'Calle', children: data?.street },
                { label: 'Referencias', children: data?.references },
            ]}
        />
    )
}
