import React from 'react'
import { ResponsePagination } from '../../../../api/interfaces/response';
import { Holiday } from '../../../../api/interfaces/holiday';
import { Table, TableProps } from 'antd';
import { QueryParams } from '../../../../api/interfaces/queryParams';

interface Props {
    data?: ResponsePagination<Holiday>;
    isPending: boolean;
    columns: TableProps<Holiday>["columns"];
    params: QueryParams;
    setParams: React.Dispatch<React.SetStateAction<QueryParams>>
}
export const TableHolidays = ({ columns, isPending, params, setParams, data }: Props) => {
    return (
        <Table
            loading={isPending}
            pagination={{
                current: (params.skip! / params.take!) + 1, pageSize: params.take, total: data?.total,
                onChange: (page, pageSize) => setParams((old) => ({ ...old, start: (page - 1) * pageSize, length: pageSize }))
            }}
            columns={columns}
            dataSource={data?.data}
            rowKey='request_holiday_id'
        />
    )
}
