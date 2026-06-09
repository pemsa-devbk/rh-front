import { useBankingByEmployee } from '../../../../hooks/bank';
import { Alert, Button, Descriptions, Flex, Skeleton, Typography } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';

interface Props {
    employeeID: string;
    openModal: () => void;
}

export const InfoBanking = ({ employeeID, openModal }: Props) => {
    const { data, error, isFetching } = useBankingByEmployee(employeeID);
    if (isFetching)
        return <Skeleton loading={isFetching} />

    if (error)
        return <>
            <Typography.Title level={5}>Información bancaria</Typography.Title>
            <Alert type='error' message='Error al obtener información bancaria del empleado' />
        </>;
    if (!data)
        return <>
            <Flex justify='space-between'>
                <Typography.Title level={5}>Información bancaria</Typography.Title>
                <Button onClick={openModal} type='text' icon={<PlusOutlined />}></Button>
            </Flex>
            <Alert type='warning' message='No hay información registrada' />
        </>;


    return (
        <Descriptions
            title='Información bancaria'
            size='small'
            column={3}
            layout='vertical'
            extra={<Button type='text' onClick={openModal} icon={<EditOutlined />} />}
            items={[
                { label: 'Banco', children: data?.bank_name },
                { label: 'CLABE', children: <Typography.Paragraph copyable>{data?.CLABE}</Typography.Paragraph>, span: 2 },
                { label: 'Número de cuenta', children: <Typography.Paragraph copyable>{data?.account_number}</Typography.Paragraph> },
            ]}
        />
    )
}
