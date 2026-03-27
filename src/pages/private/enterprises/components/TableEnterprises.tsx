import React from 'react'
import { ResponsePagination } from '../../../../api/interfaces/response';
import { Table, TableProps } from 'antd';
import { QueryParams } from '../../../../api/interfaces/queryParams';
import { Enterprise } from '../../../../api/interfaces/enterprise';

interface Props {
    data?: ResponsePagination<Enterprise>;
    isPending: boolean;
    columns: TableProps<Enterprise>["columns"];
    params: QueryParams;
    setParams: React.Dispatch<React.SetStateAction<QueryParams>>
}

export const TableEnterprises = ({ columns, isPending, params, setParams, data }: Props) => {
    return (
        <Table
            loading={isPending}
            pagination={{
                current: (params.skip! / params.take!) + 1, pageSize: params.take, total: data?.total,
                onChange: (page, pageSize) => setParams((old) => ({ ...old, start: (page - 1) * pageSize, length: pageSize }))
            }}
            columns={columns}
            dataSource={data?.data}
            rowKey='enterprise_id'
        />
    )
}
