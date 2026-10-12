import { useMemo } from 'react';
import { ColumnsType } from 'antd/es/table';
import { ColumnTitle } from 'antd/es/table/interface';
import React from 'react';
import type { TableStore } from '../store/tables/tableApi';

interface ManageColumnsOptions<T> {
    label: ColumnTitle<T>;
    value: React.Key | undefined;
}
type TableStoreHook = <U>(
    selector: (state: TableStore) => U,
) => U;

export function useManageColumns<T>(
    columns: ColumnsType<T> | undefined,
    store: TableStoreHook,
) {
    const checkedList = store((state) => state.visibleColumns);
    const setCheckedList = store((state) => state.setVisibleColumns);
    const resetColumns = store((state) => state.resetColumns);

    const options = useMemo<ManageColumnsOptions<T>[]>(
        () =>
            columns?.filter(opt => !opt.hidden).map(({ key, title }) => ({
                label: title,
                value: key,
            })) ?? [],
        [columns],
    );

    const newColumns = useMemo(
        () =>
            columns?.map((item) => ({
                ...item,
                hidden:
                    item.key == null ||
                    !checkedList.includes(item.key) || item.hidden,
            })) ?? [],
        [columns, checkedList],
    );

    return {
        checkedList,
        setCheckedList,
        resetColumns,
        options,
        columns: newColumns,
    };

}
