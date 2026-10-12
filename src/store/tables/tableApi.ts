import { Key } from "react";
import { StateCreator } from "zustand";

export interface TableStore {
    visibleColumns: Key[];
    setVisibleColumns: (columns: Key[]) => void;
    resetColumns: () => void;
}

export const createTableStore = (defaultColumns: Key[]): StateCreator<TableStore> => {
    return (set) => ({
        visibleColumns: [...defaultColumns],
        setVisibleColumns: (columns) => {
            set({
                visibleColumns: columns,
            });
        },
        resetColumns: () => {
            set({
                visibleColumns: [...defaultColumns],
            });
        },
    });

};
