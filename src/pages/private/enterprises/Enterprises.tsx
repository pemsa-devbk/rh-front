import { useState } from 'react'
import { QueryParams } from '../../../api/interfaces/queryParams';
import { Enterprise } from '../../../api/interfaces/enterprise';
import { useEnterprises } from '../../../hooks/enterprise';
import { useColumns } from './hooks/useColumns';
import { TableEnterprises } from './components/TableEnterprises';
import { DrawerCreate } from './components/DrawerCreate';
import { Button, Col, Flex, Row, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DrawerEdit } from './components/DrawerEdit';
import { ModalCreate as ModalSignature } from '../signature/components/ModalCreate';
import { ModalEdit as ModalEditSignature } from '../signature/components/ModalEdit';
import { DrawerSignature } from '../signature/components/DrawerSignature';
import { InputSearch } from '../../../components/InputSearch';
import { useModals } from '../../../hooks/useModals';

const MODAL_KEYS = ['create', 'edit', 'create_signature', 'update_signature', 'get_signature'];
type ModalKeys = typeof MODAL_KEYS[number];

export const Enterprises = () => {

  const [params, setParams] = useState<QueryParams>({
    skip: 0,
    take: 10,
    search: ''
  });
  const { data, isPending } = useEnterprises(params);

  const { openModal, closeModal, isOpen } = useModals<ModalKeys>(MODAL_KEYS);
  const [selectedEnterprise, setSelectedEnterprise] = useState<Enterprise>();

  const columns = useColumns({ openModal, setSelectedEnterprise });

  const setSearch = (search: string) => {
    setParams((old) => ({ ...old, search }));
  }

  return (
    <>
      <Flex justify='space-between' align='center' style={{ marginBottom: '1rem' }}>
        <Typography.Title style={{ margin: 0, padding: 0 }}>Empresas</Typography.Title>
        <Button size='large' icon={<PlusOutlined />} type='primary' onClick={() => openModal('create')} >Agregar</Button>
      </Flex>
      <Row style={{ marginBottom: '2rem', background: '#fff', padding: '1.5rem 1rem', borderRadius: '10px', boxShadow: '2px 5px 5px #e4e4e4' }} gutter={10}>
        <Col sm={14}>
          <Flex vertical gap={10}>
            <Typography.Text strong>¿Qué empresa deseas buscar?</Typography.Text>
            <InputSearch setSearch={setSearch} />
          </Flex>
        </Col>
        <Col sm={5}>
          {/* Contenido */}
        </Col>
        <Col sm={5}>
          {/* Contenido */}
        </Col>
      </Row>

      <DrawerCreate onClose={() => closeModal('create')} open={isOpen('create')} />
      <DrawerEdit onClose={() => closeModal('edit')} open={isOpen('edit')} enterprise={selectedEnterprise} />
      <ModalSignature onClose={() => closeModal('create_signature')} open={isOpen('create_signature')} enterprise={selectedEnterprise} />
      <ModalEditSignature onClose={() => closeModal('update_signature')} open={isOpen('update_signature')} enterprise={selectedEnterprise} />
      <DrawerSignature onClose={() => closeModal('get_signature')} open={isOpen('get_signature')} enterprise={selectedEnterprise} />
      <TableEnterprises columns={columns} isPending={isPending} params={params} setParams={setParams} data={data} />
    </>
  )
}
