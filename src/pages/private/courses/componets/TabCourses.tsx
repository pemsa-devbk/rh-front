import React, { useMemo } from 'react'
import { useInfiniteCoursesByEmployee, useRemoveEmployeesToCourse, useUploadProof } from '../../../../hooks/course';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Button, Divider, List, notification, Popconfirm, Tooltip, Typography, Upload } from 'antd';
import dayjs from '../../../../helpers/dayjs'
import { DeleteOutlined, DownloadOutlined, QuestionCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Course } from '../../../../api/interfaces/course';
import { downloadProof } from '../../../../api/course';
import { downloadFile } from '../../../../helpers/download';
interface Props {
    employeeID: string;
}

export const TabCourses = ({ employeeID }: Props) => {
    const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteCoursesByEmployee(employeeID, true, '');
    const { mutate: uploadProof, isPending } = useUploadProof();
    const { mutate: removeUser, isPending: isDeleting } = useRemoveEmployeesToCourse();

    const courses = useMemo(() =>
        data?.pages.flatMap(p => p.data) ?? [],
        [data?.pages]
    );
    const handleCustomRequest = (options: any, course: Course) => {
        const { file } = options;
        const formData = new FormData();
        formData.append('proof', file);
        uploadProof({ courseID: course.course_id, employeeID: employeeID, formData })
    }
    const handleDelete = (course: Course) => {
        removeUser({ courseID: course.course_id, employeeID: employeeID })
    }

    const handleDownloadProof = async ({ course_id, name: courseName }: Course) => {
        try {
            const { blob, headers } = await downloadProof({ courseID: course_id, employeeID: employeeID });
            downloadFile({ blob, headers, customFileName: `${employeeID}-${courseName}` })
        } catch (error) {
            notification.error({
                message: 'Error al descargar',
                description: 'No se pudo descargar el archivo'
            });
        }

    }

    return (
        <InfiniteScroll
            dataLength={courses.length}
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={isFetching}
            endMessage={<Divider>No hay mas datos</Divider>}
            scrollableTarget="scrollableDiv"
        >
            <List
                dataSource={courses}
                renderItem={(course) => (
                    <List.Item
                        key={`course-${course.course_id}`}
                        actions={[
                            <Tooltip title="Descargar comprobante">
                                <Button disabled={course.have_proof} onClick={() => handleDownloadProof(course)} size='small' variant='filled' color='blue' icon={<DownloadOutlined />}></Button>
                            </Tooltip>,
                            <Tooltip title="Subir comprobate" placement='left' >
                                <Upload
                                    showUploadList={false}
                                    name='file'
                                    maxCount={1}
                                    customRequest={(options) => handleCustomRequest(options, course)}
                                >
                                    <Button loading={isPending} disabled={isPending} size='small' variant='filled' color='blue' icon={<UploadOutlined />} />
                                </Upload>
                            </Tooltip>,
                            <Popconfirm
                                title='Salir del curso'
                                description={`Eliminar al empleado`}
                                onConfirm={() => handleDelete(course)}
                                okText="Eliminar"
                                cancelText="Cancelar"
                                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                            >
                                <Button loading={isDeleting} size='small' variant='filled' color='red' icon={<DeleteOutlined />}></Button>
                            </Popconfirm>
                        ]}
                    >
                        <List.Item.Meta
                            title={course.name}
                            description={<Typography.Text>
                                Del {dayjs(course.date_start).format('DD [de] MMMM [de] YYYY')} al {dayjs(course.date_end).format('DD [de] MMMM [de] YYYY')}
                            </Typography.Text>}
                        />
                    </List.Item>
                )}
            >
            </List>
        </InfiniteScroll>
    )
}
