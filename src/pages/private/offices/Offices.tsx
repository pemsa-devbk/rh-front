import { useState } from 'react'
import { QueryParams } from '../../../api/interfaces/queryParams';
import { Office } from '../../../api/interfaces/office';
import { useOffices, useOfficesByEnterprise } from '../../../hooks/office';
import { OfficeQueryContext, useColumns } from './hooks/useColumns';
import { Button, Col, Flex, Row, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { TableOffices } from './components/TableOffices';
import { DrawerCreate } from './components/DrawerCreate';
import { DrawerEdit } from './components/DrawerEdit';
import { InputSearch } from '../../../components/InputSearch';
import { Enterprise } from '../../../api/interfaces/enterprise';
import { useModals } from '../../../hooks/useModals';

interface Props {
    enterprise?: Enterprise;
    context?: OfficeQueryContext;
}

const MODAL_KEYS = ['edit'];
type ModalKeys = typeof MODAL_KEYS[number];

export const Offices = ({ enterprise, context }: Props) => {
    const [params, setParams] = useState<QueryParams>({
        skip: 0,
        take: 10,
        search: ''
    });

    const { data, isPending } = enterprise ? useOfficesByEnterprise(enterprise.enterprise_id, params) : useOffices(params);
    const [selectedOffice, setSelectedOffice] = useState<Office>();
    const { openModal, closeModal, isOpen } = useModals<ModalKeys>(MODAL_KEYS);

    const columns = useColumns({ openModal, setSelectedOffice, context });

    const setSearch = (search: string) => {
        setParams((old) => ({ ...old, search }));
    }
    return (
        <>
            <Flex justify='space-between' align='center' style={{ marginBottom: '1rem' }}>
                <Typography.Title style={{ margin: 0, padding: 0 }}>Oficinas</Typography.Title>
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

            <DrawerCreate enterprise={enterprise} onClose={() => closeModal('create')} open={isOpen('create')} />
            <DrawerEdit onClose={() => closeModal('edit')} open={isOpen('edit')} office={selectedOffice} />
            <TableOffices columns={columns} isPending={isPending} params={params} setParams={setParams} data={data} />
        </>
    )
}
