import { useState } from 'react'
import { useSpecialUsers, useUpdateConfig } from '../../../hooks/general'
import { Button, Drawer, Form, Layout, Space, Table } from 'antd';
import { GetColumns } from './utils/get_colums_special';
import { FormConfig, SpecialUser } from '../../../api/general';
import { SelectWithSearch } from '../../../components/SelectWithSearch';
import { Employee } from '../../../api/interfaces/employee';
import { useInfiniteEmployees } from '../../../hooks/employee';

export const SpecialUsers = () => {
    const { data } = useSpecialUsers();
    const [open, setOpen] = useState(false);
    const [selectedConfig, setSelectedConfig] = useState<SpecialUser>();
    const [form] = Form.useForm<FormConfig>();
    const { mutate } = useUpdateConfig( () => {
        form.resetFields();
        setOpen(false);
    });
    const columns = GetColumns({ setOpen, setSelectedConfig });
    const handleFormSubmit = (values: FormConfig) => {
        mutate({ key: selectedConfig!.key, user_id: values.user_id })
    }
    return (
        <Layout.Content>
            <Drawer
                title={`Actualizar configuración ${selectedConfig?.description}`}
                open={open}
                onClose={() => setOpen(false)}
                extra={
                    <Space>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button htmlType='submit' type="primary" onClick={() => form.submit()}>
                            Submit
                        </Button>
                    </Space>
                }
            >
                <Form
                    layout='vertical'
                    form={form}
                    onFinish={handleFormSubmit}
                >
                    <SelectWithSearch<Employee> 
                        label='Usuario'
                        labelKey='name'
                        valueKey='user_id'
                        name='user_id'
                        placeHolder='Seleccione un usuario'
                        useQuery={(search, enabled) => useInfiniteEmployees(enabled, search)}
                        required
                    />
                </Form>
            </Drawer>
            <Table
                dataSource={data}
                columns={columns}
            />
        </Layout.Content>
    )
}
