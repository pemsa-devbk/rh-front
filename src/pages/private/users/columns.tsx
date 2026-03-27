import { Avatar, Button, Popconfirm, Space, Switch, TableProps, Tooltip } from "antd"
import { StatusUser, User } from "../../../api/interfaces/user"
import { useChangeState } from "../../../hooks/user";
import { NavLink } from "react-router-dom";
import { ContactsOutlined, DownloadOutlined, EditOutlined, EyeOutlined, RocketOutlined, SignatureOutlined } from "@ant-design/icons";
import { base_url } from "../../../api/rh";
import { getCredential, getSignature } from "../../../api/user";


interface Props {
    refetch: () => void;
    setSelectedUser: React.Dispatch<React.SetStateAction<User | undefined>>;
    setStateOpenModal: (type: "edit" | "create" | 'viewContacts' | 'viewHolidays') => void
}

export const GetColumns = ({ refetch, setSelectedUser, setStateOpenModal }: Props): TableProps<User>['columns'] => {

    const { mutate: changeState } = useChangeState();

    const download = (user: User) => {
        getCredential(user.user_id)
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `credencial-${user.user_id}.pdf`);
                document.body.appendChild(link);
                link.click()
            })
    }
    const downloadSignature = (user: User) => {
        getSignature(user.user_id)
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `firma-${user.user_id}.png`);
                document.body.appendChild(link);
                link.click()
            })
    }
    const openModalEdit = (user: User) => {
        setSelectedUser(user);
        setStateOpenModal('edit');
    }

    const openDrawerContacts = (user: User) => {
        setSelectedUser(user);
        setStateOpenModal('viewContacts');
    }

    const openDrawerHolidays = (user: User) => {
        setSelectedUser(user);
        setStateOpenModal('viewHolidays');
    }

    return [
        {
            title: 'Num. Empleado',
            dataIndex: 'user_id',
            key: 'id'
        },
        {
            title: 'Rol',
            dataIndex: 'rol',
            key: 'rol'
        },
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'Name'
        },
        {
            title: 'CURP',
            dataIndex: 'curp',
            key: 'curp'
        },
        {
            title: 'Foto',
            key: 'foto',
            render: (_, record) => (
                <Avatar size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 60 }}
                    src={<img src={`${base_url}users/photo/${record.user_id}`} alt="avatar" />} />
            )
        },
        {
            title: 'Fecha de ingreso',
            dataIndex: 'contract_date',
            key: 'contractDate',
            render: (value) => (
                <span>{value}</span>
            )
        },
        {
            title: 'Estatus',
            key: 'status',
            dataIndex: 'status',
            render: (value, record) => (
                <span>{(value === StatusUser.activo) ? 'Activo' : (value === StatusUser.baja) ? 'Inactivo (Baja)' : 'Vacaciones'} </span>
            )
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <NavLink to={`/dashboard/mostarInfo/${record.user_id}`} className="table__body-item-button">
                        <Tooltip title="Ver">
                            <Button shape="circle" icon={<EyeOutlined />} />
                        </Tooltip>
                    </NavLink>

                    <Tooltip title="Ver contactos">
                        <Button onClick={() => openDrawerContacts(record)} shape="circle" icon={<ContactsOutlined />} />
                    </Tooltip>

                    <Tooltip title="Ver vacaciones">
                        <Button onClick={() => openDrawerHolidays(record)} shape="circle" icon={<RocketOutlined />} />
                    </Tooltip>

                    <Tooltip title="Editar">
                        <Button onClick={() => openModalEdit(record)} shape="circle" icon={<EditOutlined />} />
                    </Tooltip>

                    <Tooltip title="Descargar credencial">
                        <Button shape="circle" icon={<DownloadOutlined />} onClick={() => download(record)} />
                    </Tooltip>

                    <Tooltip title="Descargar firma (correo)">
                        <Button shape="circle" icon={<SignatureOutlined />} onClick={() => downloadSignature(record)} />
                    </Tooltip>
                </Space>
            ),
        }
    ];
}

