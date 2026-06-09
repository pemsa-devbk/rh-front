import { Alert, Button, Descriptions, Flex, Skeleton, Typography } from 'antd';
import { useMedicalByEmployee } from '../../../../hooks/medical';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';

interface Props {
    employeeID: string;
    openModal: () => void;
}

export const InfoMedical = ({ employeeID, openModal }: Props) => {
    const { data, error, isFetching } = useMedicalByEmployee(employeeID);

    if (isFetching)
        return <Skeleton loading={isFetching} />

    if (error)
        return <>
            <Typography.Title level={5}>Información médica</Typography.Title>
            <Alert type='error' message='Error al obtener información medica del empleado' />
        </>;

    if (!data)
        return <>
            <Flex justify='space-between'>
                <Typography.Title level={5}>Información médica</Typography.Title>
                <Button onClick={openModal} type='text' icon={<PlusOutlined />}></Button>
            </Flex>
            <Alert type='warning' message='No hay información registrada' />
        </>;

    return (
        <Descriptions
            size='small'
            column={3}
            layout='vertical'
            title='Información médica'
            extra={<Button type='text' onClick={openModal} icon={<EditOutlined />} />}
            items={[
                { label: 'NSS', children: data?.nss },
                { label: 'Tipo de sangre', children: data?.blood_type },
                { label: 'Alergias', children: data?.allergies },
                { label: 'Enfermedades', children: data?.diseases },
            ]}
        />
    )
}
