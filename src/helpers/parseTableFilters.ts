import { FilterValue } from "antd/es/table/interface";

export const parseTableFilters = (
    filters: Record<string, FilterValue | null>
) => {
    const params: Record<string, string> = {};
    Object.entries(filters).forEach(([key, value]) => {

        if (value?.length) {
            params[key] = String(value[0]);
        }

    });
    return params;
};