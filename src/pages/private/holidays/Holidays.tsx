import { useState } from 'react'
import { Button, Table } from 'antd';
import { HolidayConfig } from '../../../api/interfaces/holiday';
import { PlusOutlined } from '@ant-design/icons';
import { useConfigHolidays } from '../../../hooks/holiday';
import { useColumnsConfig } from './hooks/useColumnsConfig';
import { useModals } from '../../../hooks/useModals';
import { DrawerUpdateConfig } from './components/DrawerUpdateConfig';
import { DrawerCreateConfig } from './components/DrawerCreateConfig';

const MODAL_KEYS = ['edit', 'create'];
type ModalKeys = typeof MODAL_KEYS[number];

export const Holidays = () => {
    const { data, isPending } = useConfigHolidays();
    
    const [selectedConfig, setSelectedConfig] = useState<HolidayConfig>();

    const {openModal, closeModal, isOpen} = useModals<ModalKeys>(MODAL_KEYS);
    const columns = useColumnsConfig({openModal, setSelectedConfig});

    return (
        <>
            <DrawerCreateConfig 
                closeModal={() => closeModal('create')}
                open={isOpen('create')}
            />
            
            <DrawerUpdateConfig
                closeModal={() => closeModal('edit')}
                config={selectedConfig}
                open={isOpen('edit')}
            />
           
            
            <Button icon={<PlusOutlined />} type='primary' onClick={() => openModal('create')} >Agregar</Button>

            <Table
                loading={isPending}
                dataSource={data}
                columns={columns}
                rowKey='holiday_config_id'
            />
        </>
    )
}
