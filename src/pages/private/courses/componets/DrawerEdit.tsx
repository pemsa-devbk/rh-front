import { Button, DatePicker, Drawer, Form, Input, Space } from 'antd';
import { useUpdateCourse } from '../../../../hooks/course';
import { Course, FormUpdateCourse } from '../../../../api/interfaces/course';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { getUpdatedFields } from '../../../../helpers/getUpdateFields';

interface Props {
    open: boolean;
    onClose: () => void;
    course: Course | undefined;
}

export const DrawerEdit = ({ onClose, open, course }: Props) => {
    const { mutate } = useUpdateCourse();
    const [form] = Form.useForm<FormUpdateCourse>();

    const handleFormSubmit = (values: FormUpdateCourse) => {
        const parseValues: FormUpdateCourse = {
            name: values.name,
            // @ts-ignore
            date_end: values.date_end.format('YYYY-MM-DD'),
            // @ts-ignore
            date_start: values.date_start.format('YYYY-MM-DD'),
        }
        const changes:FormUpdateCourse = getUpdatedFields(course!, parseValues);
        if(Object.keys(changes).length === 0) return;

        mutate({ courseID: course!.course_id, formCourse: changes }, {
            onSuccess() {
                form.resetFields();
                onClose();
            },
        })
    }

    useEffect(() => {
        if (course && open) {
            const courseParser = {
                course_id: course.course_id,
                date_end: dayjs(course.date_end),
                date_start: dayjs(course.date_start),
                name: course.name
            }
            form.setFieldsValue(courseParser);
        }
    }, [course, open])

    return (
        <Drawer
            title={`Editar curso ${course?.name}`}
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

            </Form>
        </Drawer>
    )
}
