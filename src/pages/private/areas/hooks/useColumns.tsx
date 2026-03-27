import { Badge, Button, Popconfirm, Space, TableProps, Tooltip } from "antd";
import { DeleteTwoTone, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { Area } from "../../../../api/interfaces/area";
import { useDeleteArea } from "../../../../hooks/area";
import { useCallback, useMemo } from "react";

export enum AreaQueryContext {
    FROM_DEPARTMENT = 'FROM_DEPARTMENT',   // Desde /departments/:id/areas → Solo área
    FROM_OFFICE = 'FROM_OFFICE',           // Desde /offices/:id/areas → Department + Área 
    FROM_ENTERPRISE = 'FROM_ENTERPRISE',   // Desde /enterprises/:id/areas → Office + Department + Área 
    FROM_GENERAL = 'FROM_GENERAL'          // Desde /areas → Enterprise + Office + Department + Área
}

interface Props {
    openModal: (key: string) => void;
    setSelectedArea: React.Dispatch<React.SetStateAction<Area | undefined>>;
    context?: AreaQueryContext;
}

const VISIBLE_CONTEXTS: Record<string, AreaQueryContext[]> = {
    enterprise_name: [AreaQueryContext.FROM_GENERAL],
    office_name:     [AreaQueryContext.FROM_GENERAL, AreaQueryContext.FROM_ENTERPRISE],
    department_name:     [AreaQueryContext.FROM_GENERAL, AreaQueryContext.FROM_ENTERPRISE, AreaQueryContext.FROM_OFFICE],
};

export const useColumns = ({ openModal, setSelectedArea, context = AreaQueryContext.FROM_GENERAL }: Props): TableProps<Area>['columns'] => {
    const { mutate } = useDeleteArea();

    const handleUpdate = useCallback((area: Area) => {
        setSelectedArea(area);
        openModal('edit');
    }, [openModal, setSelectedArea]);

    const handleDelete = useCallback((area: Area) => {
        mutate({ areaID: area.area_id, departmentID: area.department_id });
    }, []);
    
    return useMemo<TableProps<Area>['columns']>( () => [
        {
            title: 'Nombre',
            dataIndex: 'name',
        },
        {
            title: 'Empresa',
            dataIndex: 'enterprise_name',
            hidden: !VISIBLE_CONTEXTS['enterprise_name'].includes(context),
        },
        {
            title: 'Oficina',
            dataIndex: 'office_name',
            hidden: !VISIBLE_CONTEXTS['office_name'].includes(context)
        },
        {
            title: 'Departamento',
            dataIndex: 'department_name',
            hidden: !VISIBLE_CONTEXTS['department_name'].includes(context)
        },
        {
            dataIndex: 'total_positions',
            title: 'Puestos'
        },
        {
            title: 'Empleados',
            dataIndex: 'total_employees'
        },
        {
            dataIndex: 'responsible_name',
            title: 'Encargado',
            render(value) {
                return <>{value || <Badge color='gold' status='processing' text='No asignado' />}</>
            },
        },
        {
            title: 'Acciones',
            render: (_, record) => (
                <Space wrap>
                    <NavLink to={`/dashboard/departments/${record.department_id}/areas/${record.area_id}`}>
                        <Tooltip title="Ver">
                            <Button color="cyan" variant="outlined" icon={<EyeOutlined />} />
                        </Tooltip>
                    </NavLink>
                    <Tooltip title="Editar">
                        <Button onClick={() => handleUpdate(record)} color="gold" variant="outlined" icon={<EditOutlined />} />
                    </Tooltip>
                    {/* <Tooltip title="Ver puestos">
                        <Button onClick={() => viewPositions(record)} color="gr" variant="outlined" icon={<EyeOutlined />} />
                    </Tooltip> */}

                    <Popconfirm
                        title="Eliminar"
                        description={`Eliminar el area ${record.name}`}
                        onConfirm={() => handleDelete(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button variant="outlined" danger icon={<DeleteTwoTone twoToneColor='#f00' />}></Button>
                    </Popconfirm>

                </Space>
            )
        }
    ], [context, setSelectedArea, openModal]);
}