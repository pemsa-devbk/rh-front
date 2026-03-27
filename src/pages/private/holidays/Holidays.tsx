import { useEffect, useState } from 'react'
import { Button, Drawer, Form,  InputNumber, Popconfirm, Space, Table, TableProps, Tooltip } from 'antd';
import { HolidayConfig, HolidayCOnfigForm } from '../../../api/interfaces/holiday';
import { DeleteTwoTone, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useConfigHolidays, useCreateConfig, useDeleteConfig } from '../../../hooks/holiday';
import { useUpdateConfig } from '../../../hooks/general';

export const Holidays = () => {
    const { data, isPending, refetch } = useConfigHolidays();
    const { mutate: createConfig } = useCreateConfig();
    const { mutate: updateConfig } = useUpdateConfig();
    const {mutate: deleteConfig} = useDeleteConfig();
    const [openModal, setOpenModal] = useState({
        create: false,
        edit: false,
    });
    const [formCreate] = Form.useForm<HolidayCOnfigForm>();
    const [formUpdate] = Form.useForm<HolidayCOnfigForm>();
    const [selectedConfig, setselectedConfig] = useState<HolidayConfig>();
    const columns: TableProps<HolidayConfig>['columns'] = [
        {
            title: 'Minimo de años laborados',
            dataIndex: 'min_year',
        },
        {
            title: 'Maximo de años laborados',
            dataIndex: 'max_year',
        },
        {
            title: 'Días de vacaciones',
            dataIndex: 'number_days',
        },
        {
            title: 'Acciones',
            render: (_, record) => (
                <Space wrap>
                    <Tooltip title="Editar">
                        <Button onClick={ () => {
                            setselectedConfig(record);
                            setStateModal('edit')
                        }} color="gold" variant="outlined" icon={<EditOutlined />} />
                    </Tooltip>
                    <Popconfirm
                        title="Eliminar configuración"
                        description={`Eliminar`}
                        onConfirm={() => handleDelete(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button variant="outlined" danger icon={<DeleteTwoTone twoToneColor='#f00' />}></Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];
    const handleDelete = (item: HolidayConfig) => {
        deleteConfig(item.holiday_config_id, {
            onSuccess(data, variables, context) {
                refetch();
            },
        })
    }
    const setStateModal = (modal: 'create' | 'edit'): void => {
        setOpenModal((old) => ({ ...old, [modal]: !openModal[modal] }))
    }

    const handleFormCreateSubmit = (values: HolidayCOnfigForm) => {
        createConfig(values, {
            onSuccess() {
                refetch();
                formCreate.resetFields();
            },
        })
    }

    const handleFormUpdateSubmit = (values: Partial<HolidayCOnfigForm>) => {
        updateConfig({ id: selectedConfig!.holiday_config_id, dataSend: values }, {
            onSuccess() {
                refetch();
                formUpdate.resetFields();
            },
        })
    }
    useEffect(() => {
      if(selectedConfig) formUpdate.setFieldsValue(selectedConfig);
    }, [selectedConfig])
    
    return (
        <>
            <Drawer
                title="Crear configuración"
                open={openModal.create}
                onClose={() => setStateModal('create')}
                extra={
                    <Space>
                        <Button onClick={() => setStateModal('create')}>Cancel</Button>
                        <Button type="primary" onClick={() => formCreate.submit()}>
                            Guardar
                        </Button>
                    </Space>
                }
            >
                <Form
                    layout="vertical"
                    form={formCreate}
                    onFinish={handleFormCreateSubmit}
                >
                    <Form.Item
                        label="Años minimos"
                        name="min_year"
                        rules={[{ required: true, message: "Campo requerido" }]}
                    >
                        <InputNumber />
                    </Form.Item>
                    <Form.Item
                        label="Años maximos"
                        name="max_year"
                        rules={[{ required: true, message: "Campo requerido" }]}
                    >
                        <InputNumber />
                    </Form.Item>
                    <Form.Item
                        label="Número de días"
                        name="number_days"
                        rules={[{ required: true, message: "Campo requerido" }]}
                    >
                        <InputNumber />
                    </Form.Item>

                </Form>
            </Drawer>
            <Drawer
                title="Actualizar configuración"
                open={openModal.edit}
                onClose={() => setStateModal('edit')}
                extra={
                    <Space>
                        <Button onClick={() => setStateModal('edit')}>Cancel</Button>
                        <Button type="primary" onClick={() => formUpdate.submit()}>
                            Guardar
                        </Button>
                    </Space>
                }
            >
                <Form
                    layout="vertical"
                    form={formUpdate}
                    onFinish={handleFormUpdateSubmit}
                >
                    <Form.Item
                        label="Años minimos"
                        name="min_year"
                    >
                        <InputNumber />
                    </Form.Item>
                    <Form.Item
                        label="Años maximos"
                        name="max_year"
                    >
                        <InputNumber />
                    </Form.Item>
                    <Form.Item
                        label="Número de días"
                        name="number_days"
                    >
                        <InputNumber />
                    </Form.Item>

                </Form>
            </Drawer>
            <Button icon={<PlusOutlined />} type='primary' onClick={() => setStateModal('create')} >Agregar</Button>

            <Table
                loading={isPending}
                dataSource={data}
                columns={columns}
                rowKey='holiday_config_id'
            />
        </>
    )
}
