import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space } from "antd";
import { ColumnTitle, ColumnType } from "antd/es/table/interface";

export function createColumnFilterText<T>(
    columnName: string,
    title: ColumnTitle<T>
): ColumnType<T> {
    return {
        title,

        key: columnName,

        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    placeholder={`Buscar ${String(title)}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    style={{ marginBottom: 8, display: 'block' }}
                    onPressEnter={() => confirm()}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => confirm()}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Buscar
                    </Button>
                    <Button
                        onClick={() => {
                            clearFilters?.()
                            confirm();
                        }}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Limpiar
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Cerrar
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
    };
}