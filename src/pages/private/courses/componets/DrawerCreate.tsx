import { Button, DatePicker, Drawer, Form, Input, Space } from 'antd';
import  { useState } from 'react'
import { useCreateCourse } from '../../../../hooks/course';
import { FormCourse } from '../../../../api/interfaces/course';
import { useInfiniteUsers } from '../../../../hooks/user';
import { SelectWithSearch } from '../../../../components/SelectWithSearch';
import { User } from '../../../../api/interfaces/user';

interface Props {
    open: boolean;
    onClose: () => void;
}

export const DrawerCreate = ({ onClose, open }: Props) => {
    const { mutate } = useCreateCourse();
    const [form] = Form.useForm<FormCourse>();
    const [search, setSearch] = useState('');
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useInfiniteUsers(open, search);

    const handleFormSubmit = (values: FormCourse) => {
        const parseValues: FormCourse = {
            name: values.name,
            // @ts-ignore
            date_end: values.date_end.format('YYYY-MM-DD'),
            // @ts-ignore
            date_start: values.date_start.format('YYYY-MM-DD'),
            users: values.users
        }
        mutate(parseValues, {
            onSuccess() {
                form.resetFields();
            },
        })
    }


    return (
        <Drawer
            title="Crear curso"
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
                <Form.Item
                    label="Nombre"
                    name="name"
                    rules={[{ required: true, message: "El nombre es requerido" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="date_start"
                    label="Fecha de inicio"
                    rules={[{ required: true, message: 'La fecha de inicio es obligatoria' }]}
                >
                    <DatePicker style={{ width: '100%' }} format={'YYYY-MM-DD'} />
                </Form.Item>

                <Form.Item
                    name="date_end"
                    label="Fecha de termino"
                    rules={[{ required: true, message: 'La fecha de inicio es obligatoria' }]}
                >
                    <DatePicker style={{ width: '100%' }} format={'YYYY-MM-DD'} />
                </Form.Item>

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
