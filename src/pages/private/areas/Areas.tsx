import { useState } from 'react'
import { useAreas, useAreasByDepartment, useAreasByEnterprise, useAreasByOffice } from '../../../hooks/area'
import { QueryParams } from '../../../api/interfaces/queryParams';
import { DrawerCreate } from './components/DrawerCreate';
import { Button, Col, Flex, Row, Typography } from 'antd';
import { TableAreas } from './components/TableAreas';
import { Area } from '../../../api/interfaces/area';
import { PlusOutlined } from '@ant-design/icons';
import { DrawerEdit } from './components/DrawerEdit';
import { InputSearch } from '../../../components/InputSearch';
import { Enterprise } from '../../../api/interfaces/enterprise';
import { Office } from '../../../api/interfaces/office';
import { Department } from '../../../api/interfaces/department';
import { AreaQueryContext, useColumns } from './hooks/useColumns';
import { useModals } from '../../../hooks/useModals';

interface Props {
  enterprise?: Enterprise;
  office?: Office;
  department?: Department;
  context?: AreaQueryContext;
}
const MODAL_KEYS = ['edit', 'create'];
type ModalKeys = typeof MODAL_KEYS[number];

export const Areas = ({ enterprise, office, department, context }: Props) => {
  const [params, setParams] = useState<QueryParams>({
    skip: 0,
    take: 10,
    search: ''
  });

  const { data, isPending } = enterprise ? useAreasByEnterprise(enterprise.enterprise_id, params)
    : office ? useAreasByOffice(office.office_id, params)
      : department ? useAreasByDepartment(department.department_id, params) : useAreas(params);

  const [selectedArea, setSelectedArea] = useState<Area>();
  const {openModal, closeModal, isOpen} = useModals<ModalKeys>(MODAL_KEYS);

  const columns = useColumns({context, openModal, setSelectedArea});

  const setSearch = (search: string) => {
    setParams((old) => ({ ...old, search }));
  }

  return (
    <>
      <Flex justify='space-between' align='center' style={{ marginBottom: '1rem' }}>
        <Typography.Title style={{ margin: 0, padding: 0 }}>Areas</Typography.Title>
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

      <DrawerCreate enterprise={enterprise} office={office} department={department} open={isOpen('create')} onClose={() => closeModal('create')} />
      <DrawerEdit open={isOpen('edit')} onClose={() => closeModal('edit')} area={selectedArea} />
      <TableAreas columns={columns} isPending={isPending} params={params} setParams={setParams} data={data} />
    </>
  )
}
