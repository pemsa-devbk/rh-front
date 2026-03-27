import React from 'react'
import { ResponsePagination } from '../../../../api/interfaces/response';
import { Office } from '../../../../api/interfaces/office';
import { Table, TableProps } from 'antd';
import { QueryParams } from '../../../../api/interfaces/queryParams';

interface Props {
    data?: ResponsePagination<Office>;
    isPending: boolean;
    columns: TableProps<Office>["columns"];
    params: QueryParams;
    setParams: React.Dispatch<React.SetStateAction<QueryParams>>
}

export const TableOffices = ({ columns, isPending, params, setParams, data }: Props) => {
    return (
        <Table
            loading={isPending}
            pagination={{
                current: (params.skip! / params.take!) + 1, pageSize: params.take, total: data?.total,
                onChange: (page, pageSize) => setParams((old) => ({ ...old, start: (page - 1) * pageSize, length: pageSize }))
            }}
            columns={columns}
            dataSource={data?.data}
            rowKey='office_id'
        />
    )
}
