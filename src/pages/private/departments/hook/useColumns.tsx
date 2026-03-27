import { Badge, Button, Popconfirm, Space, TableProps, Tooltip } from 'antd';
import { DeleteTwoTone, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { Department } from '../../../../api/interfaces/department';
import { useDeleteDepartment } from '../../../../hooks/department';

export enum DepartmentQueryContext {
    FROM_OFFICE = 'FROM_OFFICE',           // Desde /offices/:id/departments → Solo departamentos
    FROM_ENTERPRISE = 'FROM_ENTERPRISE',   // Desde /enterprises/:id/departments → Departamento + Office
    FROM_GENERAL = 'FROM_GENERAL'          // Desde /departments → departamento + Office + Enterprise
}

interface Props {
    setSelectedDepartment: React.Dispatch<React.SetStateAction<Department | undefined>>;
    openModal: (key: string) => void;
    context?: DepartmentQueryContext;
}

const VISIBLE_CONTEXTS: Record<string, DepartmentQueryContext[]> = {
    enterprise_name: [DepartmentQueryContext.FROM_GENERAL],
    office_name:     [DepartmentQueryContext.FROM_GENERAL, DepartmentQueryContext.FROM_ENTERPRISE],
};

export const useColumns = ({ openModal, setSelectedDepartment, context = DepartmentQueryContext.FROM_GENERAL }: Props): TableProps<Department>['columns'] => {
    const { mutate } = useDeleteDepartment();

    const handleUpdate = useCallback((department: Department) => {
        setSelectedDepartment(department);
        openModal('edit');
    }, [openModal, setSelectedDepartment]);

    const handleDelete = useCallback((department: Department) => {
        mutate({ officeID: department.office_id, departmentID: department.department_id });
    }, []);

    return useMemo<TableProps<Department>['columns']>( () => [
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
            dataIndex: 'office_name',
            title: 'Oficina',
            hidden: !VISIBLE_CONTEXTS['office_name'].includes(context)
        },
        {
            title: 'Empleados',
            dataIndex: 'total_employees'
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
            title: 'Responsable',
            dataIndex: 'responsible_name',
            render(value) {
                return <>{value || <Badge color='gold' status='processing' text='No asignado' />}</>
            },
        },
        {
            title: 'Acciones',
            render: (_, record) => (
                <Space wrap>
                    <NavLink to={`/dashboard/offices/${record.office_id}/departments/${record.department_id}`}>
                        <Tooltip title="Ver">
                            <Button color="cyan" variant="outlined" icon={<EyeOutlined />} />
                        </Tooltip>
                    </NavLink>
                    <Tooltip title="Editar">
                        <Button onClick={() => handleUpdate(record)} color="gold" variant="outlined" icon={<EditOutlined />} />
                    </Tooltip>
                    <Popconfirm
                        title="Eliminar"
                        description={`Eliminar el departamento ${record.name}`}
                        onConfirm={() => handleDelete(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button variant="outlined" danger icon={<DeleteTwoTone twoToneColor='#f00' />}></Button>
                    </Popconfirm>
                </Space>
            )
        }
    ], [context, setSelectedDepartment, openModal]);
}