import { useState } from 'react'
import { QueryParams } from '../../../api/interfaces/queryParams';
import { Button, Col, DatePicker, Flex, notification, Row, Skeleton, Space, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { TableCourses } from './componets/TableCourses';
import { GetColumns } from './get_columns';
import { useCourses, useRemoveUsersToCourse, useUploadProof } from '../../../hooks/course';
import { Course } from '../../../api/interfaces/course';
import { DrawerCreate } from './componets/DrawerCreate';
import { InputSearch } from '../../../components/InputSearch';
import { DrawerEdit } from './componets/DrawerEdit';
import { DrawerAdd } from './componets/DrawerAdd';
import { DrawerList } from '../../../components/DrawerList';
import { useInfiniteUsersByCourse } from '../../../hooks/user';
import { User } from '../../../api/interfaces/user';
import { OptionsForUser } from './componets/OptionsForUser';
import { downloadProof } from '../../../api/course';
import { downloadFile } from '../../../helpers/download';

export const Courses = () => {

    const [params, setParams] = useState<QueryParams>({
        skip: 0,
        take: 10,
        search: ''
    });
    const [openModal, setOpenModal] = useState({
        create: false,
        edit: false,
        view_users: false,
        add_users: false,
    });
    const [selectedCourse, setSelectedCourse] = useState<Course>();

    const { data, isPending, refetch, isFetching } = useCourses(params);
    const { data: dataUsers, fetchNextPage, hasNextPage, isLoading: isFetchingUsers } = useInfiniteUsersByCourse(selectedCourse?.course_id || NaN, (openModal.view_users && !!selectedCourse), '');
    const { mutate: removeUser, isPending: isPendingRemoveUser, variables } = useRemoveUsersToCourse();
    const { mutate: uploadProof, isPending: isPendingUpload, variables: variablesUpload } = useUploadProof();

    const setStateModal = (modal: 'create' | 'edit' | 'view_users' | 'add_users') => {
        setOpenModal((old) => ({ ...old, [modal]: !openModal[modal] }));
    }
    const columns = GetColumns({ openModal: setStateModal, setSelectedCourse });

    const setSearch = (search: string) => {
        setParams((old) => ({ ...old, search }));
    }

    const handleDownloadProof = async ({ course_id, name: courseName }: Course, { user_id, name }: User) => {
        try {
            const { blob, headers } = await downloadProof({ courseID: course_id, userID: user_id });
            downloadFile({blob, headers, customFileName:`${name}-${courseName}`})
        } catch (error) {
            notification.error({
                message: 'Error al descargar',
                description: 'No se pudo descargar el archivo'
            });
        }

    }

    return (
        <>
            <Flex justify='space-between' align='center' style={{ marginBottom: '1rem' }}>
                <Typography.Title style={{ margin: 0, padding: 0 }}>Cursos</Typography.Title>
                <Button size='large' icon={<PlusOutlined />} type='primary' onClick={() => setStateModal('create')} >Agregar</Button>
            </Flex>
            <Row style={{ marginBottom: '2rem', background: '#fff', padding: '1.5rem 1rem', borderRadius: '10px', boxShadow: '2px 5px 5px #e4e4e4' }} gutter={10}>
                <Col sm={14}>
                    <Flex vertical gap={10}>
                        <Typography.Text strong>¿Qué curso deseas buscar?</Typography.Text>
                        <InputSearch setSearch={setSearch} />
                    </Flex>
                </Col>
                <Col sm={5}>
                    <Flex vertical gap={10}>
                        <Typography.Text strong>Fecha inicial</Typography.Text>
                        <DatePicker disabled />
                    </Flex>
                </Col>
                <Col sm={5}>
                    <Flex vertical gap={10}>
                        <Typography.Text strong>Fecha final</Typography.Text>
                        <DatePicker disabled />
                    </Flex>
                </Col>
            </Row>

            <DrawerCreate onClose={() => setStateModal('create')} open={openModal.create} />
            <DrawerList<User>
                loading={isFetchingUsers}
                title='Empledos registrados'
                hasMore={hasNextPage}
                itemKey='user_id'
                loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                nextFn={fetchNextPage}
                onClose={() => setStateModal('view_users')}
                open={openModal.view_users}
                titleKey='name'
                descriptionKey={(user) => user.email || 'Sin correo'}
                dataSource={dataUsers}
                extraButtons={
                    <Space>
                        <Button onClick={() => setStateModal('view_users')}>Cancel</Button>
                    </Space>
                }
                renderActions={(user) =>
                    selectedCourse ? (
                        <OptionsForUser
                            handleCustomRequest={(options) => {
                                const { file } = options;
                                const formData = new FormData();
                                formData.append('proof', file);
                                uploadProof({ courseID: selectedCourse.course_id, userID: user.user_id, formData })
                            }}
                            isUpload={isPendingUpload && variablesUpload.userID === user.user_id}
                            user={user}
                            isDeleting={isPendingRemoveUser && variables.userID === user.user_id}
                            onDelete={() => removeUser({ courseID: selectedCourse.course_id, userID: user.user_id })}
                            handleDownload={() => handleDownloadProof(selectedCourse, user)}
                        />
                    ) : null}
            />
            <DrawerEdit onClose={() => setStateModal('edit')} open={openModal.edit} course={selectedCourse} />
            <DrawerAdd onClose={() => setStateModal('add_users')} open={openModal.add_users} course={selectedCourse} />
            <TableCourses columns={columns} isPending={isPending} params={params} setParams={setParams} data={data} refetch={refetch} isFetching={isFetching} />
        </>
    )
}
