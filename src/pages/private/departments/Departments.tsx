import { useState } from 'react'
import { QueryParams } from '../../../api/interfaces/queryParams';
import { Button, Col, Flex, Row, Table, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { InputSearch } from '../../../components/InputSearch';
import { Enterprise } from '../../../api/interfaces/enterprise';
import { useModals } from '../../../hooks/useModals';
import { Office } from '../../../api/interfaces/office';
import { useDepartments, useDepartmentsByEnterprise, useDepartmentsByOffice } from '../../../hooks/department';
import { DepartmentQueryContext, useColumns, } from './hook/useColumns';
import { Department } from '../../../api/interfaces/department';
import { DrawerCreate } from './components/DrawerCreate';
import { DrawerEdit } from './components/DrawerEdit';

interface Props {
    enterprise?: Enterprise;
    office?: Office;
    context?: DepartmentQueryContext;
}

const MODAL_KEYS = ['edit', 'create'];
type ModalKeys = typeof MODAL_KEYS[number];

export const Departments = ({ enterprise, office, context }: Props) => {
    const [params, setParams] = useState<QueryParams>({
        skip: 0,
        take: 10,
        search: ''
    });

    const { data, isPending } = enterprise ? useDepartmentsByEnterprise(enterprise.enterprise_id, params)
        : office ? useDepartmentsByOffice(office.office_id, params) : useDepartments(params);

    const [selectedDepartment, setSelectedDepartment] = useState<Department>();
    const { openModal, closeModal, isOpen } = useModals<ModalKeys>(MODAL_KEYS);

    const columns = useColumns({ openModal, setSelectedDepartment, context });

    const setSearch = (search: string) => {
        setParams((old) => ({ ...old, search }));
    }
    return (
        <>
            <Flex justify='space-between' align='center' style={{ marginBottom: '1rem' }}>
                <Typography.Title style={{ margin: 0, padding: 0 }}>Departamentos</Typography.Title>
                <Button size='large' icon={<PlusOutlined />} type='primary' onClick={() => openModal('create')} >Agregar</Button>
            </Flex>
            <Row style={{ marginBottom: '2rem', background: '#fff', padding: '1.5rem 1rem', borderRadius: '10px', boxShadow: '2px 5px 5px #e4e4e4' }} gutter={10}>
                <Col sm={14}>
                    <Flex vertical gap={10}>
                        <Typography.Text strong>¿Qué oficina deseas buscar?</Typography.Text>
                        <InputSearch setSearch={setSearch} />
                    </Flex>
                </Col>
                <Col sm={5}>
                    {/*  */}
                </Col>
                <Col sm={5}>
                    {/*  */}
                </Col>
            </Row>

            <DrawerCreate enterprise={enterprise} office={office} onClose={() => closeModal('create')} open={isOpen('create')} />
            <DrawerEdit onClose={() => closeModal('edit')} open={isOpen('edit')} department={selectedDepartment} />
            <Table
                loading={isPending}
                pagination={{
                    current: (params.skip! / params.take!) + 1, pageSize: params.take, total: data?.total,
                    onChange: (page, pageSize) => setParams((old) => ({ ...old, start: (page - 1) * pageSize, length: pageSize }))
                }}
                columns={columns}
                dataSource={data?.data}
                rowKey='department_id'
            />
        </>
    )
}
