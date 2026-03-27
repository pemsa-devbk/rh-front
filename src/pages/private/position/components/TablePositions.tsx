import { Table, TableProps } from 'antd'
import React from 'react'
import { ResponsePagination } from '../../../../api/interfaces/response'
import { QueryParams } from '../../../../api/interfaces/queryParams';
import { Position } from '../../../../api/interfaces/position';

interface Props {
  data?: ResponsePagination<Position>;
  isPending: boolean;
  columns: TableProps<Position>["columns"];
  params: QueryParams;
  setParams: React.Dispatch<React.SetStateAction<QueryParams>>
}

export const TablePositions = ({ columns, isPending, params, setParams, data }: Props) => {

  return (
    <Table
      loading={isPending}
      pagination={{
        current: (params.skip! / params.take!) + 1, pageSize: params.take, total: data?.total,
        onChange: (page, pageSize) => setParams((old) => ({ ...old, start: (page - 1) * pageSize, length: pageSize }))
      }}
      columns={columns}
      dataSource={data?.data}
      rowKey='position_id'
    />
  )
}
