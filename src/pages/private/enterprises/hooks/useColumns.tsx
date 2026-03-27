import { Button, Popconfirm, Space, TableProps, Tooltip } from 'antd';
import { DeleteTwoTone, DownloadOutlined, EditOutlined, EyeOutlined, SignatureOutlined } from '@ant-design/icons';
import { Enterprise } from '../../../../api/interfaces/enterprise';
import { useDeleteEnterpise } from '../../../../hooks/enterprise';
import { NavLink } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

interface Props{
    setSelectedEnterprise: React.Dispatch<React.SetStateAction<Enterprise | undefined>>;
    openModal: (key: string) => void;
}

export const useColumns = ({ openModal, setSelectedEnterprise }: Props): TableProps<Enterprise>['columns'] => {
    const { mutate } = useDeleteEnterpise();
    
    const handleUpdate = useCallback((enterpise: Enterprise) => {
        setSelectedEnterprise(enterpise);
        openModal('edit');
    }, [setSelectedEnterprise, openModal]);

    const getSignature = useCallback((enterpise: Enterprise) => {
        setSelectedEnterprise(enterpise);
        openModal('get_signature');
    }, [setSelectedEnterprise, openModal]);

    const handleDelete = useCallback((enterpise: Enterprise) => {
        mutate(enterpise.enterprise_id);
    }, []);

    const hanldeCreateSignature = useCallback((enteprise: Enterprise) => {
        setSelectedEnterprise(enteprise);
        openModal('create_signature');
    }, [setSelectedEnterprise, openModal]);

    const hanldeEditSignature = useCallback((enteprise: Enterprise) => {
        setSelectedEnterprise(enteprise);
        openModal('update_signature');
    },[ setSelectedEnterprise, openModal]);


    return useMemo<TableProps<Enterprise>['columns']>( () => [
        {
            title: 'Nombre',
            dataIndex: 'name'
        },
        {
            dataIndex: 'address',
            title: 'Dirección'
        },
        {
            title: 'Empleados',
            dataIndex: 'total_employees'
        },
        {
            title: 'Oficinas',
            dataIndex: 'total_offices'
        },
        {
            title: 'Areas',
            dataIndex: 'total_areas'
        },
        {
            title: 'Puestos',
            dataIndex: 'total_positions'
        },
        {
            title: 'Acciones',
            render: (_, record) => (
                <Space wrap>
                    <NavLink to={`${record.enterprise_id}`}>
                        <Tooltip title="Ver">
                            <Button color="cyan" variant="outlined" icon={<EyeOutlined />} />
                        </Tooltip>
                    </NavLink>
                    <Tooltip title="Editar">
                        <Button onClick={() => handleUpdate(record)} color="gold" variant="outlined" icon={<EditOutlined />} />
                    </Tooltip>
                    <Tooltip title="Descargar firma">
                        <Button onClick={() => getSignature(record)} color="lime" variant="outlined" icon={<DownloadOutlined />} />
                    </Tooltip>
                    {
                        record.signature_id
                            ?
                            <Tooltip title="Editar firma">
                                <Button onClick={ () => hanldeEditSignature(record)} color='green' variant='outlined' icon={<SignatureOutlined />} />
                            </Tooltip>
                            :
                            <Tooltip title="Añadir firma">
                                <Button onClick={ () => hanldeCreateSignature(record) } color='green' variant='outlined' icon={<SignatureOutlined />} />
                            </Tooltip>
                    }

                    <Popconfirm
                        title="Eliminar"
                        description={`Eliminar la empresa ${record.name}`}
                        onConfirm={() => handleDelete(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button variant="outlined" danger icon={<DeleteTwoTone twoToneColor='#f00' />}></Button>
                    </Popconfirm>
                </Space>
            )
        }
    ], [setSelectedEnterprise, openModal]);
}