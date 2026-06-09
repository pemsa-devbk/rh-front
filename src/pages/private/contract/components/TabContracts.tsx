import { useContractsByEmployee, useDeleteContract } from '../../../../hooks/contract';
import { Alert, Button, Card, Flex, Popconfirm, Skeleton, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Contract, ContractType } from '../../../../api/interfaces/contract';
import dayjs from '../../../../helpers/dayjs';
import { DrawerCreate } from './DrawerCreate';
import { useModals } from '../../../../hooks/useModals';

interface Props {
    employeeID: string;
}

const MODAL_KEYS = ['create', 'edit'];
type ModalKeys = typeof MODAL_KEYS[number];


export const TabContracts = ({ employeeID }: Props) => {
    const { data, error, isFetching } = useContractsByEmployee(employeeID);
    const { mutate: deleteContact } = useDeleteContract();
    const { openModal, closeModal, isOpen } = useModals<ModalKeys>(MODAL_KEYS);

    const handleDeleteContact = (contract: Contract) => {
        deleteContact({ contractID: contract.contract_id, employeeID: employeeID })
    }

    if (isFetching)
        return <Skeleton loading={isFetching} />

    if (error)
        return <Alert type='error' message='Error al obtener información de contratos del empleado' />;

    if (!data)
        return <>
            <Flex justify='flex-end'>
                <Button type='text' icon={<PlusOutlined />}></Button>
            </Flex>
            <Alert type='warning' message='No hay información registrada' />
        </>;

    return (
        <>
            <DrawerCreate employeeID={employeeID} modalKey='create' onClose={closeModal} open={isOpen('create')} />
            <Button onClick={() => openModal('create')} type='primary' style={{ marginRight: 0, marginLeft: 'auto', display: 'block', marginBottom: 10 }} icon={<PlusOutlined />} >Añadir contrato</Button>
            <Flex vertical>
                {data.map(contract => (
                    <Card title={`TIPO DE CONTRATO: ${contract.type === ContractType.TEMPORARY ? 'temporal' : 'Indeterminado'}`} extra={<Button type='text' icon={
                        <Popconfirm
                            title="Eliminar"
                            description={`Eliminar el contrato con validez al ${contract.validity}`}
                            onConfirm={() => handleDeleteContact(contract)}
                            okText="Yes"
                            cancelText="No"
                        ><DeleteOutlined /></Popconfirm>} />} >
                        <Typography.Text>Vigencia: </Typography.Text>
                        <Typography.Text type='success'>{
                            contract.validity ? dayjs(contract.validity).format('DD [de] MMMM [de] YYYY') : 'Sin vigencia'
                        }</Typography.Text>
                        <br />
                        <Typography.Text>Fecha de creación: {dayjs(contract.created_at).format('DD [de] MMMM [de] YYYY [a las] HH:MM')}</Typography.Text>
                    </Card>
                ))}
            </Flex>
        </>
    )
}
