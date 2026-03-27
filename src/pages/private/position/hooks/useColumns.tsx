import { Button, Popconfirm, Space, TableProps, Tooltip } from "antd";
import { DeleteTwoTone, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Position } from "../../../../api/interfaces/position";
import { useDeletePosition } from "../../../../hooks/position";
import { NavLink } from "react-router-dom";
import { useCallback, useMemo } from "react";

export enum PositionQueryContext {
    FROM_AREA = 'FROM_AREA',               // Desde /areas/:id/positions → Solo Position
    FROM_DEPARTMENT = 'FROM_DEPARTMENT',   // Desde /departments/:id/positions → Área + Position
    FROM_OFFICE = 'FROM_OFFICE',           // Desde /offices/:id/positions → Solo Department + Área + Position
    FROM_ENTERPRISE = 'FROM_ENTERPRISE',   // Desde /enterprises/:id/positions → Office + Department + Área + Position
    FROM_GENERAL = 'FROM_GENERAL'          // Desde /positions → Enterprise + Office + Department + Área + Position
}

interface Props {
    openModal: (key: string) => void;
    setSelectedPosition: React.Dispatch<React.SetStateAction<Position | undefined>>;
    context?: PositionQueryContext;
}
const VISIBLE_CONTEXTS: Record<string, PositionQueryContext[]> = {
    enterprise_name: [PositionQueryContext.FROM_GENERAL],
    office_name:     [PositionQueryContext.FROM_GENERAL, PositionQueryContext.FROM_ENTERPRISE],
    department_name:     [PositionQueryContext.FROM_GENERAL, PositionQueryContext.FROM_ENTERPRISE, PositionQueryContext.FROM_OFFICE],
    area_name:     [PositionQueryContext.FROM_GENERAL, PositionQueryContext.FROM_ENTERPRISE, PositionQueryContext.FROM_OFFICE, PositionQueryContext.FROM_DEPARTMENT],
};

export const useColumns = ({ openModal, setSelectedPosition, context = PositionQueryContext.FROM_GENERAL }: Props): TableProps<Position>['columns'] => {
    const { mutate } = useDeletePosition();

    const handleUpdate = useCallback((position: Position) => {
        setSelectedPosition(position);
        openModal('edit');
    }, [openModal, setSelectedPosition]);

    const handleDelete = useCallback((position: Position) => {
        mutate({ positionID: position.position_id, areaID: position.area_id });
    }, []);

    return useMemo<TableProps<Position>['columns']>( () => [
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
            title: 'Area',
            dataIndex: 'area_name',
            hidden: !VISIBLE_CONTEXTS['area_name'].includes(context)
        },
        {
            title: 'Empleados',
            dataIndex: 'total_employees'
        },
        {
            title: 'Acciones',
            render: (_, record) => (
                <Space wrap>
                    <NavLink to={`/dashboard/areas/${record.area_id}/positions/${record.position_id}`}>
                        <Tooltip title="Ver">
                            <Button color="cyan" variant="outlined" icon={<EyeOutlined />} />
                        </Tooltip>
                    </NavLink>

                    <Tooltip title="Editar">
                        <Button onClick={() => handleUpdate(record)} color="gold" variant="outlined" icon={<EditOutlined />} />
                    </Tooltip>

                    <Popconfirm
                        title="Eliminar puesto"
                        description={`Eliminar el puesto ${record.name}`}
                        onConfirm={() => handleDelete(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button variant="outlined" danger icon={<DeleteTwoTone twoToneColor='#f00' />}></Button>
                    </Popconfirm>

                </Space>
            )
        }
    ], [context, setSelectedPosition, openModal]);
}