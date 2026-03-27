import React from 'react'
import { ResponsePagination } from '../../../../api/interfaces/response';
import { Course } from '../../../../api/interfaces/course';
import { Button, Table, TableProps } from 'antd';
import { QueryParams } from '../../../../api/interfaces/queryParams';


interface Props {
    data?: ResponsePagination<Course>;
    isPending: boolean;
    columns: TableProps<Course>["columns"];
    params: QueryParams;
    setParams: React.Dispatch<React.SetStateAction<QueryParams>>;
    refetch: () => void;
    isFetching: boolean;
}


export const TableCourses = ({ columns, isPending, params, setParams, data, refetch, isFetching }: Props) => {
    return (
        <Table
        title={() => <Button loading={isFetching} onClick={() => refetch()}>Recargar</Button>}
            loading={isPending}
            pagination={{
                current: (params.skip! / params.take!) + 1, pageSize: params.take, total: data?.total,
                onChange: (page, pageSize) => setParams((old) => ({ ...old, start: (page - 1) * pageSize, length: pageSize }))
            }}
            columns={columns}
            dataSource={data?.data}
            rowKey='course_id'
        />
    )
}
