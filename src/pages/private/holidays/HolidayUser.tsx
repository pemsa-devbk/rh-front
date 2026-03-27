import { useState } from 'react'
import { TableHolidays } from './components/TableHolidays';
import { useHolidays } from '../../../hooks/holiday';
import { QueryParams } from '../../../api/interfaces/queryParams';
import { GetColumns } from './get_columns';
import { Button, Flex } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DrawerCreate } from './components/DrawerCreate';

interface Props {
    id?: string;
}

export const HolidayUser = ({ id }: Props) => {
    const [params, setParams] = useState<QueryParams>({
        skip: 0,
        take: 10
    });
    const [open, setOpen] = useState(false);
    const { data, isPending, refetch } = useHolidays(params, id);
    const columns = GetColumns({id, refetch});
    return (
        <>
            <Flex justify='end' style={{ marginBottom: 15 }}>
                <Button type="primary" onClick={() => setOpen(true)} icon={<PlusOutlined />} >
                    Nuevo registro
                </Button>
            </Flex>
            <DrawerCreate onClose={() => setOpen(false)} open={open} refetch={refetch} id={id} />

            <TableHolidays data={data} columns={columns} isPending={isPending} params={params} setParams={setParams} />
        </>
    )
}
