import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createTableStore, TableStore } from "./tableApi";

const defaultColumns = ['user_id', 'name','employee_actions'];

export const useColumnsEmployee = create<TableStore>()(
    devtools(
        persist(
            createTableStore(defaultColumns),
            {
                name: 'table_employee',
                partialize: (state) => ({
                    visibleColumns: state.visibleColumns,
                }),
            },
        ),
    ),
);