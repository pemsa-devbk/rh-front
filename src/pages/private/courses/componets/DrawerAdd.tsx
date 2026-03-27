import { Button, Drawer, Form, Space } from 'antd';
import  { useState } from 'react'
import { useAssignUsersToCourse } from '../../../../hooks/course';
import { Course, FormAssignUsers } from '../../../../api/interfaces/course';
import { useInfiniteUsers } from '../../../../hooks/user';
import { SelectWithSearch } from '../../../../components/SelectWithSearch';
import { User } from '../../../../api/interfaces/user';

interface Props {
    open: boolean;
    onClose: () => void;
    course?: Course;
}

export const DrawerAdd = ({ onClose, open, course }: Props) => {
    const { mutate } = useAssignUsersToCourse();
    const [form] = Form.useForm<FormAssignUsers>();
    const [search, setSearch] = useState('');
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useInfiniteUsers(open, search);

    const handleFormSubmit = (values: FormAssignUsers) => {
        mutate({formUsersAssign: values, courseID: course!.course_id}, {
            onSuccess() {
                form.resetFields();
                onClose();
            },
        })
    }


    return (
        <Drawer
            title={`Asignar usuarios al curso ${course?.name}`}
            open={open}
            onClose={onClose}
            extra={
                <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" onClick={() => form.submit()}>
                        Guardar
                    </Button>
                </Space>
            }
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={handleFormSubmit}
            >
                <SelectWithSearch<User>
                    label="Usuarios que tomarán el curso"
                    name="users"
                    mode='multiple'
                    placeHolder="Seleccione los usuarios"
                    fetchNextPage={fetchNextPage}
                    loading={isFetchingNextPage || isFetching}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    labelKey='name'
                    valueKey='user_id'
                    items={data}
                    setSearch={setSearch}
                />

            </Form>
        </Drawer>
    )
}
