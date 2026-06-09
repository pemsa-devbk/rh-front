import { useLicenseByEmployee } from '../../../../hooks/license';
import { Alert, Button, Descriptions, Flex, Skeleton, Typography } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { LicenseType } from '../../../../api/interfaces/license';


interface Props {
    employeeID: string;
    openModal: () => void;
}


export const InfoLicense = ({ employeeID, openModal }: Props) => {
    const { data, error, isFetching } = useLicenseByEmployee(employeeID);
    if (isFetching)
        return <Skeleton loading={isFetching} />

    if (error)
        return <>
            <Typography.Title level={5}>Licencia</Typography.Title>
            <Alert type='error' message='Error al obtener información licencia del empleado' />
        </>;
        
    if (!data)
        return <>
            <Flex justify='space-between'>
                <Typography.Title level={5}>Licencia</Typography.Title>
                <Button onClick={openModal} type='text' icon={<PlusOutlined />}></Button>
            </Flex>
            <Alert type='warning' message='No hay información registrada' />
        </>;
    return (
        <Descriptions 
            title='Licencia'
            size='small'
            column={3}
            layout='vertical'
            extra={<Button type='text' onClick={openModal} icon={<EditOutlined />} />}
            items={[
                { label: 'Tipo', children: data?.type === LicenseType.COMMERCIAL ? 'Comercial' : 'Particular' },
                { label: 'Fecha de emisión', children: data.issue_date, span: 2 },
                { label: 'Valides', children: data.validity },
            ]}
        />
    )
}
