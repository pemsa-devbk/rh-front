import { Button, Popconfirm, Space, TableProps, Tooltip } from 'antd';
import { Office } from '../../../../api/interfaces/office';
import { useDeleteOffice } from '../../../../hooks/office';
import { DeleteTwoTone, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

export enum OfficeQueryContext {
    FROM_ENTERPRISE = 'FROM_ENTERPRISE',   // Desde /enterprises/:id/offices
    FROM_GENERAL = 'FROM_GENERAL'
}
interface Props {
    setSelectedOffice: React.Dispatch<React.SetStateAction<Office | undefined>>;
    openModal: (key: string) => void;
    context?: OfficeQueryContext;
}

const VISIBLE_CONTEXTS: Record<string, OfficeQueryContext[]> = {
    enterprise_name: [OfficeQueryContext.FROM_GENERAL],
};

export const useColumns = ({ openModal, setSelectedOffice, context = OfficeQueryContext.FROM_GENERAL }: Props): TableProps<Office>['columns'] => {
    const { mutate } = useDeleteOffice();

    const handleUpdate = useCallback((office: Office) => {
        setSelectedOffice(office);
        openModal('edit');
    }, [openModal, setSelectedOffice]);

    const handleDelete = useCallback((office: Office) => {
        mutate({ officeID: office.office_id, enterpriseID: office.enterprise_id });
    }, []);

    return useMemo<TableProps<Office>['columns']>( () => [
        {
            title: 'Nombre',
            dataIndex: 'name'
        },
        {
            dataIndex: 'enterprise_name',
            title: 'Empresa',
            hidden: !VISIBLE_CONTEXTS['enterprise_name'].includes(context)
        },
        {
            title: 'Empleados',
            dataIndex: 'total_employees'
        },
        {
            title: 'Departamentos',
            dataIndex: 'total_departments'
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
                    <NavLink to={`/dashboard/enterprises/${record.enterprise_id}/offices/${record.office_id}`}>
                        <Tooltip title="Ver">
                            <Button color="cyan" variant="outlined" icon={<EyeOutlined />} />
                        </Tooltip>
                    </NavLink>
                    <Tooltip title="Editar">
                        <Button onClick={() => handleUpdate(record)} color="gold" variant="outlined" icon={<EditOutlined />} />
                    </Tooltip>
                    <Popconfirm
                        title="Eliminar"
                        description={`Eliminar la oficina ${record.name}`}
                        onConfirm={() => handleDelete(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button variant="outlined" danger icon={<DeleteTwoTone twoToneColor='#f00' />}></Button>
                    </Popconfirm>
                </Space>
            )
        }
    ], [context, setSelectedOffice, openModal]);
}