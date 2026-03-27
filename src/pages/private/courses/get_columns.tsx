import { Button, Popconfirm, Space, TableProps, Tooltip } from 'antd';
import { Course } from '../../../api/interfaces/course';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useDeleteCourse } from '../../../hooks/course';

interface Props {
    openModal: (modal: 'create' | 'edit' | 'view_users' | 'add_users') => void;
    setSelectedCourse: React.Dispatch<React.SetStateAction<Course | undefined>>;
}

export const GetColumns = ({ openModal, setSelectedCourse}: Props):TableProps<Course>['columns'] => {
    const {mutate: deleteCoruse} = useDeleteCourse();
    const editCourse = (course: Course) => {
        setSelectedCourse(course);
        openModal('edit');
    }

    const addUsers = (course: Course) => {
        setSelectedCourse(course);
        openModal('add_users');
    }

    const viewUsers = (course: Course) => {
        setSelectedCourse(course);
        openModal('view_users');
    }

    return [
        {
            title: 'Nombre',
            dataIndex: 'name'
        },
        {
            title: 'Fecha de inicio',
            dataIndex: 'date_start',

        },
        {
            title: 'Fecha de termino',
            dataIndex: 'date_end',
        },
        {
            title: 'Usuarios inscritos',
            dataIndex: 'total_users'
        },
        {
            title: 'Acciones',
            render: (_, record) => (
                <Space wrap>
                    <Tooltip title="Editar">
                        <Button onClick={() => editCourse(record)} color='gold' variant="filled" icon={<EditOutlined />} />
                    </Tooltip>
                    <Tooltip title="Ver usuarios inscritos">
                        <Button onClick={() => viewUsers(record)} color='cyan' variant="filled" icon={<EyeOutlined />} />
                    </Tooltip>
                    <Tooltip title="Agregar usuario">
                        <Button onClick={() => addUsers(record)} color='green' variant="filled" icon={<PlusOutlined />} />
                    </Tooltip>
                    <Popconfirm
                        title="Eliminar curso"
                        description={`Eliminar el curso ${record.name}`}
                        onConfirm={() => deleteCoruse(record.course_id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button color='red' variant="filled" icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            )
        }
    ];
}