import { Button, Popconfirm, Space, Tooltip, type TableProps } from 'antd';
import { HolidayConfig } from '../../../../api/interfaces/holiday';
import { useCallback, useMemo } from 'react';
import { DeleteTwoTone, EditOutlined } from '@ant-design/icons';
import { useDeleteConfig } from '../../../../hooks/holiday';
interface Props {
    openModal: (key: string) => void;
    setSelectedConfig: React.Dispatch<React.SetStateAction<HolidayConfig | undefined>>;

}

export const useColumnsConfig = ({ openModal, setSelectedConfig }: Props): TableProps<HolidayConfig>['columns'] => {
    const { mutate } = useDeleteConfig();

    const handleDelete = useCallback((config: HolidayConfig) => {
        mutate(config.holiday_config_id)
    }, []);
    

    return useMemo<TableProps<HolidayConfig>['columns']>(() => [
        {
            title: 'Minimo de años laborados',
            dataIndex: 'min_year',
        },
        {
            title: 'Maximo de años laborados',
            dataIndex: 'max_year',
        },
        {
            title: 'Días de vacaciones',
            dataIndex: 'number_days',
        },
        {
            title: 'Acciones',
            render: (_, record) => (
                <Space wrap>
                    <Tooltip title="Editar">
                        <Button onClick={() => {
                            setSelectedConfig(record);
                            openModal('edit')
                        }} color="gold" variant="outlined" icon={<EditOutlined />} />
                    </Tooltip>
                    <Popconfirm
                        title="Eliminar configuración"
                        onConfirm={() => handleDelete(record)}
                        okText="Si"
                        cancelText="No"
                    >
                        <Button variant="outlined" danger icon={<DeleteTwoTone twoToneColor='#f00' />}></Button>
                    </Popconfirm>
                </Space>
            )
        }
    ], []);
}