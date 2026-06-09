import { Button, Space, TableProps, Tooltip } from "antd";
import { SpecialUser } from '../../../../api/general';
import { EditOutlined } from "@ant-design/icons";

interface Props {
    setSelectedConfig: React.Dispatch<React.SetStateAction<SpecialUser | undefined>>;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GetColumns = ({setSelectedConfig, setOpen}: Props): TableProps<SpecialUser>['columns'] => {

    const edit = (specialUser: SpecialUser) => {
        setSelectedConfig(specialUser);
        setOpen(true);
    }

    return [
        {
            title: 'KEY',
            dataIndex: 'key',
            key: 'key'
        },
        {
            title: 'Descripción',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: 'Usuario',
            dataIndex: 'user_name',
            render(value) {
                return <>{ value ? value : 'No establecido'}</>
            }
        },
        {
            title: 'Acciones',
            render: (_, record) => (
                <Space wrap>
                    <Tooltip title="Editar">
                        <Button onClick={() => edit(record)} color="gold" variant="outlined" icon={<EditOutlined />} />
                    </Tooltip>
                </Space>
            )
        }
    ];
}