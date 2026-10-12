import { TablePaginationConfig } from "antd";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { QueryParams } from "../api/interfaces/queryParams";
interface Props<T> {
    pagination: TablePaginationConfig;
    filters: Record<string, FilterValue | null>;
    sorter: SorterResult<T> | SorterResult<T>[];
    setParams: (value: React.SetStateAction<QueryParams>) => void
}
export function handleTableChange<T>({ filters, pagination, setParams, sorter }: Props<T>) {
    const columnFilters: Record<string, string> = {};

    Object.entries(filters).forEach(([key, value]) => {
        if (value && value.length > 0) {
            columnFilters[key] = String(value[0]);
        }
    });

    const currentSorter = Array.isArray(sorter)
        ? sorter[0]
        : sorter;

    setParams((old) => {
        // Eliminamos los filtros anteriores
        const newParams = { ...old };

        Object.keys(filters).forEach((key) => {
            delete newParams[key as keyof typeof newParams];
        });
        

        return {
            ...newParams,

            skip: (pagination.current! - 1) * (pagination.pageSize || old.take!),
            take: pagination.pageSize ?? old.take,

            // Agregamos únicamente los filtros que existen
            ...columnFilters,

            orderBy: currentSorter?.field
                ? String(currentSorter.field)
                : undefined,

            orderDirection:
                currentSorter?.order === 'ascend'
                    ? 'ASC'
                    : currentSorter?.order === 'descend'
                        ? 'DESC'
                        : undefined,
        };
    });
}

