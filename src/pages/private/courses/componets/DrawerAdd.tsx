import { Button, Drawer, Form, Space } from 'antd';
import { useAssignEmployeesToCourse } from '../../../../hooks/course';
import { Course, FormAssignEmployees } from '../../../../api/interfaces/course';
import { SelectWithSearch } from '../../../../components/SelectWithSearch';
import { useInfiniteEmployees } from '../../../../hooks/employee';
import { Employee } from '../../../../api/interfaces/employee';

interface Props {
    open: boolean;
    onClose: () => void;
    course?: Course;
}

export const DrawerAdd = ({ onClose, open, course }: Props) => {
    const { mutate } = useAssignEmployeesToCourse();
    const [form] = Form.useForm<FormAssignEmployees>();

    const handleFormSubmit = (values: FormAssignEmployees) => {
        mutate({formAssignEmployees: values, courseID: course!.course_id}, {
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
                <SelectWithSearch<Employee>
                    label="Usuarios que tomarán el curso"
                    name="users"
                    mode='multiple'
                    placeHolder="Seleccione los usuarios"
                    labelKey='name'
                    valueKey='user_id'
                    useQuery={(search, enabled) => useInfiniteEmployees(enabled, search)}
                />

            </Form>
        </Drawer>
    )
}
