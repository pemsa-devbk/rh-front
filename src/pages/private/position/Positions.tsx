import { useState } from 'react'
import { Enterprise } from '../../../api/interfaces/enterprise';
import { Office } from '../../../api/interfaces/office';
import { Area } from '../../../api/interfaces/area';
import { Button, Col, Flex, Row, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { QueryParams } from '../../../api/interfaces/queryParams';
import { Position } from '../../../api/interfaces/position';
import { usePositions, usePositionsByArea, usePositionsByDepartment, usePositionsByEnterprise, usePositionsByOffice } from '../../../hooks/position';
import { useColumns, PositionQueryContext } from './hooks/useColumns';
import { InputSearch } from '../../../components/InputSearch';
import { DrawerCreate } from './components/DrawerCreate';
import { DrawerEdit } from './components/DrawerEdit';
import { TablePositions } from './components/TablePositions';
import { Department } from '../../../api/interfaces/department';
import { useModals } from '../../../hooks/useModals';

interface Props {
    enterprise?: Enterprise;
    office?: Office;
    department?: Department;
    area?: Area;
    context?: PositionQueryContext;
}
const MODAL_KEYS = ['edit', 'create'];
type ModalKeys = typeof MODAL_KEYS[number];

export const Positions = ({ enterprise, office, area, department, context }: Props) => {
    const [params, setParams] = useState<QueryParams>({
        skip: 0,
        take: 10,
        search: ''
    });

    const { data, isPending } =
        enterprise ? usePositionsByEnterprise(enterprise.enterprise_id, params)
            : office ? usePositionsByOffice(office.office_id, params)
                : department ? usePositionsByDepartment(department.department_id, params)
                    : area ? usePositionsByArea(area.area_id, params) : usePositions(params);
    const [selectedPosition, setSelectedPosition] = useState<Position>();
    const { openModal, closeModal, isOpen } = useModals<ModalKeys>(MODAL_KEYS);

    const columns = useColumns({ openModal, setSelectedPosition, context });

    const setSearch = (search: string) => {
        setParams((old) => ({ ...old, search }));
    }

    return (
        <>
            <Flex justify='space-between' align='center' style={{ marginBottom: '1rem' }}>
                <Typography.Title style={{ margin: 0, padding: 0 }}>Puestos</Typography.Title>
                <Button size='large' icon={<PlusOutlined />} type='primary' onClick={() => openModal('create')} >Agregar</Button>
            </Flex>
            <Row style={{ marginBottom: '2rem', background: '#fff', padding: '1.5rem 1rem', borderRadius: '10px', boxShadow: '2px 5px 5px #e4e4e4' }} gutter={10}>
                <Col sm={14}>
                    <Flex vertical gap={10}>
                        <Typography.Text strong>¿Qué area deseas buscar?</Typography.Text>
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

            <DrawerCreate enterprise={enterprise} office={office} area={area} open={isOpen('create')} onClose={() => closeModal('create')} />
            <DrawerEdit open={isOpen('edit')} onClose={() => closeModal('edit')} position={selectedPosition} />
            <TablePositions columns={columns} isPending={isPending} params={params} setParams={setParams} data={data} />
        </>
    )
}
