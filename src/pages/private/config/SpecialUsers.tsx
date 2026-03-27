import { useState } from 'react'
import { useSpecialUsers, useUpdateConfig } from '../../../hooks/general'
import { Button, Drawer, Form, Layout, Select, Space, Table } from 'antd';
import { GetColumns } from './utils/get_colums_special';
import { FormConfig, SpecialUser } from '../../../api/general';
import { useInfiniteUsers } from '../../../hooks/user';

export const SpecialUsers = () => {
    const { data, refetch } = useSpecialUsers();
    const [open, setOpen] = useState(false);
    const [selectedConfig, setSelectedConfig] = useState<SpecialUser>();
    const { data: dataUsers, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteUsers(open);
    const { mutate } = useUpdateConfig();
    const columns = GetColumns({ setOpen, setSelectedConfig });
    const [form] = Form.useForm<FormConfig>();
    const handleFormSubmit = (values: FormConfig) => {
        mutate({ key: selectedConfig!.key, user_id: values.user_id }, {
            onSettled(data, error, variables, context) {
                refetch();
            },
        })
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
                    <Form.Item
                        name="user_id"
                        label="Usuario"
                    >
                        <Select
                            placeholder="Seleccione el usuario"
                            showSearch
                            onPopupScroll={(e) => {
                                const target = e.target as HTMLElement;
                                if (target.scrollTop + target.offsetHeight >= target.scrollHeight - 10 && hasNextPage && !isFetchingNextPage) {
                                    fetchNextPage();
                                }
                            }}
                            filterOption={false}
                            loading={isFetchingNextPage}
                            options={
                                dataUsers?.pages.flatMap((page) =>
                                    page.data.map((user) => ({
                                        label: user.name,
                                        value: user.user_id,
                                    }))
                                )
                            }
                        >
                        </Select>
                    </Form.Item>
                </Form>
            </Drawer>
            <Table
                dataSource={data}
                columns={columns}
            />
        </Layout.Content>
    )
}
