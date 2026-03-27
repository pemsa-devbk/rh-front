import { Button, Col, DatePicker, Drawer, Form, Input, notification, Row, Select, Space } from 'antd';
import { useRoles } from '../../../../hooks/general';
import { useCreateUser, useInfiniteUsers } from '../../../../hooks/user';
import dayjs from 'dayjs'
// import { useInfiniteAreasByOffice } from '../../../../hooks/area';
import { useInfinitePositionsByArea } from '../../../../hooks/position';
import { useInfiniteOfficesByEnterprice } from '../../../../hooks/office';
import { useInfiniteEnterprises } from '../../../../hooks/enterprise';
import { Position } from '../../../../api/interfaces/position';
import { Area } from '../../../../api/interfaces/area';
import { Enterprise } from '../../../../api/interfaces/enterprise';
import { Office } from '../../../../api/interfaces/office';
import { FormUser } from '../../../../api/interfaces/user';
import { useState } from 'react';
import { SelectWithSearch } from '../../../../components/SelectWithSearch';

interface Props {
  open: boolean;
  onClose: () => void;
  enterprise?: Enterprise;
  office?: Office;
  area?: Area;
  position?: Position;
}

export const ModalCreate = ({ onClose, open, enterprise, area, office, position }: Props) => {
  const isFixed = { enterprise: !!enterprise || !!office || !!area || !!position, office: !!office || !!area || !!position, area: !!area || !!position, positon: !!position };
  const [form] = Form.useForm<FormUser>();
  const [search, setSearch] = useState({
    enterprise: '', office: '', area: '', position: '', user: ''
  });

  const [selectedValue, setSelectedValue] = useState({
    enterprise: enterprise ? enterprise.enterprise_id :
      office ? office.enterprise_id :
        area ? area.enterprise_id || '' :
          position ? position.enterprise_id || '' : '',
    office: office ? office.office_id :
      area ? area.office_id :
        position ? position.office_id || NaN : NaN,
    area: area ? area.area_id :
      position ? position.area_id : NaN,
  });

  const { data: roles } = useRoles();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteUsers(open, search.user);

  const { data: dataEnterprise, fetchNextPage: fetchNextPageEnterprise, hasNextPage: hasNextPageEnterprise, isFetchingNextPage: isFetchingNextPageEnterprise, isFetching: isFetchingEnterprise } = useInfiniteEnterprises((open && !isFixed.enterprise), search.enterprise);
  const { data: dataOffice, fetchNextPage: fetchNextPageOffice, hasNextPage: hasNextPageOffice, isFetchingNextPage: isFetchingNextPageOffice, isFetching: isFetchingOffice } = useInfiniteOfficesByEnterprice(selectedValue.enterprise, (open && !isFixed.office && !!selectedValue.enterprise), search.office);
  // const { data: dataArea, fetchNextPage: fetchNextPageArea, hasNextPage: hasNextPageArea, isFetchingNextPage: isFetchingNextPageArea, isFetching: isFetchingArea } = useInfiniteAreasByOffice(selectedValue.office, (open && !isFixed.area && !!selectedValue.office), search.area);
  const { data: dataPositions, fetchNextPage: fetchNextPagePositions, hasNextPage: hasNextPagePositions, isFetchingNextPage: isFetchingNextPagePositions, isFetching: isFetchingPositions } = useInfinitePositionsByArea(selectedValue.area, (open && !isFixed.positon && !!selectedValue.area), search.position);


  const { mutate } = useCreateUser( () => {
    form.resetFields();
    onClose();
  });

  const handleFormSubmit = (values: any) => {
    // * Dar formato a los datos
    let dataSend = {};

    for (const key in values) {
      const value = values[key];

      if (value === undefined || value === null) continue;

      // Manejo de fechas (Day.js)
      if (dayjs.isDayjs(value)) {
        dataSend = {...dataSend ,[key]: value.format('YYYY-MM-DD')};
      }

      // Otros valores
      else {
        dataSend = {...dataSend ,[key]: value};
      }
    }

    mutate(dataSend);
  }

  const handleSearch = (key: 'enterprise' | 'office' | 'area' | 'position' | 'user', value: string) => {
    setSearch((old) => ({ ...old, [key]: value }))
  }
  const handleChangeValue = (key: 'enterprise' | 'office' | 'area', value: string) => {
    setSelectedValue((old) => ({ ...old, [key]: value }));
    if (key == 'enterprise') form.resetFields(['office_id', 'area_id', 'position_id'])
    if (key == 'office') form.resetFields(['area_id', 'position_id'])
    if (key == 'area') form.resetFields(['position_id'])
  }

  return (
    <Drawer
      title="Crear nuevo empleado"
      size='large'
      onClose={onClose}
      open={open}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button htmlType='submit' type="primary" onClick={() => form.submit()}>
            Submit
          </Button>
        </Space>
      }
    >
      <Form form={form} onFinish={handleFormSubmit} layout="vertical" id='frm-add-employee'
        initialValues={
          enterprise ? {enterprise_id: enterprise.enterprise_id}
          : office ? {  enterprise_id: office.enterprise_id, office_id: office.office_id }
          : area ? { enterprise_id: area.enterprise_id, office_id: area.office_id, area_id: area.area_id }
          : position ? {enterprise_id: position.enterprise_id, office_id: position.office_id, area_id: position.area_id, position_id: position.position_id} 
          :undefined
        }
      >

        {/* <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="foto"
              valuePropName='foto'
              label="Foto"
              getValueFromEvent={normFile}
              rules={[
                // {
                //   required: true,
                //   message: "La foto del usuario es obligatoria"
                // },
                {
                  validator(_, value) {
                    return new Promise((res, rej) => {
                      if (value && value[0].size > 2000000)
                        rej("Sobrepasa los 2 MB")
                      res("OK")
                    })
                  },
                }

              ]}
            >
              <Upload
                name="img"
                listType="picture"
                beforeUpload={(file) => {
                  const isPNG = file.type === 'image/png' || file.type === 'image/jpeg';
                  if (!isPNG) {
                    message.error(`${file.name} no es un formato soportado`);
                  }
                  return isPNG || Upload.LIST_IGNORE;
                }}
                customRequest={({ onSuccess }) => { return onSuccess!("ok") }}
              >
                <Button icon={<UploadOutlined />}>Clic para subir foto</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="firma"
              valuePropName='firma'
              label="Firma"
              getValueFromEvent={normFile}
              rules={[
                // {
                //   required: true,
                //   message: "La firma del usuario es obligatoria"
                // },
                {
                  validator(_, value) {
                    return new Promise((res, rej) => {
                      if (value && value[0].size > 2000000)
                        rej("Sobrepasa los 2 MB")
                      res("OK")
                    })
                  },
                }

              ]}
            >
              <Upload
                name="firma"
                listType="picture"
                beforeUpload={(file) => {
                  const isPNG = file.type === 'image/png' || file.type === 'image/jpeg';
                  if (!isPNG) {
                    message.error(`${file.name} no es un formato soportado`);
                  }
                  return isPNG || Upload.LIST_IGNORE;
                }}
                customRequest={({ onSuccess }) => { return onSuccess!("ok") }}
              >
                <Button icon={<UploadOutlined />}>Clic para subir foto</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row> */}

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="user_id"
              label="NO. de empleado"
              rules={[{ required: true, message: 'El ID del empleado es obligatorio' }]}
            >
              <Input placeholder="Ingrese el número de empleado" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Nombre"
              rules={[{ required: true, message: 'El nombre es obligatorio' }]}
            >
              <Input placeholder="Nombre del empleado" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="gender"
              label="Género"
              rules={[{ required: true, message: 'Por favor selecciona el género' }]}
            >
              <Select placeholder="Seleccione el género">
                <Select.Option value="M">Masculino</Select.Option>
                <Select.Option value="F">Femenino</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="curp"
              label="CURP"
              rules={[{ required: true, message: 'La CURP del empleado es obligatorio' }]}
            >
              <Input placeholder="Ingrese la CURP del empleado" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="contract_date"
              label="Fecha de contrato"

              rules={[{ required: true, message: 'La fecha de contrato es obligatoria' }]}
            >
              <DatePicker style={{ width: '100%' }} format={'YYYY-MM-DD'} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="birthdate"
              label="Fecha de nacimiento"
              rules={[{ required: true, message: 'La fecha de nacimiento es obligatoria' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <SelectWithSearch<Enterprise>
              label="Empresa"
              name="enterprise_id"
              disabled={isFixed.enterprise}
              placeHolder={"Seleccione la empresa"}
              fetchNextPage={fetchNextPageEnterprise}
              loading={isFetchingNextPageEnterprise || isFetchingEnterprise}
              hasNextPage={hasNextPageEnterprise}
              isFetchingNextPage={isFetchingNextPageEnterprise}
              labelKey='name'
              valueKey='enterprise_id'
              items={dataEnterprise}
              defaults={
                enterprise ? [{ value: enterprise.enterprise_id, label: enterprise.name }]
                  : office ? [{ value: office.enterprise_id, label: office.enterprise_name }]
                    : area ? [{ value: area.enterprise_id, label: area.enterprise_name }]
                      : position ? [{ value: position.enterprise_id, label: position.enterprise_name }]
                        : undefined
              }
              setSearch={(value) => handleSearch('enterprise', value)}
              required
              onChange={(value) => handleChangeValue('enterprise', value)}
            />
          </Col>
          <Col span={12}>
            <SelectWithSearch<Office>
              label="Oficina"
              name="office_id"
              disabled={isFixed.office || !selectedValue.enterprise}
              placeHolder={"Seleccione la oficina"}
              fetchNextPage={fetchNextPageOffice}
              loading={isFetchingNextPageOffice || isFetchingOffice}
              hasNextPage={hasNextPageOffice}
              isFetchingNextPage={isFetchingNextPageOffice}
              labelKey='name'
              valueKey='office_id'
              defaults={
                office ? [{ value: office.office_id, label: office.name }]
                  : area ? [{ value: area.office_id, label: area.office_name }]
                    : position ? [{ value: position.office_id, label: position.office_name }]
                      : undefined
              }
              items={dataOffice}
              setSearch={(value) => handleSearch('office', value)}
              required
              onChange={(value) => handleChangeValue('office', value)}
            />
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            {/* <SelectWithSearch<Area>
              label="Area"
              name="area_id"
              disabled={isFixed.area || !selectedValue.office}
              placeHolder={"Seleccione la oficina"}
              fetchNextPage={fetchNextPageArea}
              loading={isFetchingNextPageArea || isFetchingArea}
              hasNextPage={hasNextPageArea}
              isFetchingNextPage={isFetchingNextPageArea}
              labelKey='name'
              valueKey='area_id'
              defaults={
                area ? [{ value: area.area_id, label: area.name }]
                  : position ? [{ value: position.area_id, label: position.area_name }]
                    : undefined
              }
              items={dataArea}
              setSearch={(value) => handleSearch('area', value)}
              required
              onChange={(value) => handleChangeValue('area', value)}
            /> */}
          </Col>
          <Col span={12}>
              <SelectWithSearch<Position>
                    label="Puesto"
                    name="position_id"
                    disabled={isFixed.positon || !selectedValue.area}
                    placeHolder={"Seleccione el puesto"}
                    fetchNextPage={fetchNextPagePositions}
                    loading={isFetchingNextPagePositions || isFetchingPositions}
                    hasNextPage={hasNextPagePositions}
                    isFetchingNextPage={isFetchingNextPagePositions}
                    labelKey='name'
                    valueKey='position_id'
                    defaults={
                        position ? [{ value: position.position_id, label: position.name }]
                            : undefined
                    }
                    items={dataPositions}
                    setSearch={(value) => handleSearch('position', value)}
                    required
                />
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="rol"
              label="Rol"
              rules={[{ required: true, message: 'El rol es obligatorio' }]}
            >
              <Select placeholder="Seleccione un rol">
                {
                  roles?.map(rol => {
                    return <Select.Option key={rol.value} value={rol.value}>{rol.description}</Select.Option>
                  })

                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email" label="Correo"
              rules={[{ type: 'email', message: "El formato de correo no es valido" }]}
            >
              <Input placeholder='maiil@domain.com' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="user_chief_id"
              label="Jefe directo"
            >
              <Select
                placeholder="Seleccione el jefe directo"
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
                  data?.pages.flatMap((page) =>
                    page.data.map((user) => ({
                      label: user.name,
                      value: user.user_id,
                    }))
                  )
                }
              >
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="address"
              label="Dirección"
            >
              <Input placeholder="Ingrese la dirección del empleado" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Telefono" style={{ marginBottom: 0 }}>
              <Form.Item name="phone" style={{ display: 'inline-block', width: 'calc(72%)' }}>
                <Input placeholder="Ingrese el telefono del empleado" />
              </Form.Item>
              <Form.Item name="ext" style={{ display: 'inline-block', width: 'calc(23%)' }}>
                <Input placeholder="ext" />
              </Form.Item>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="cell_phone" label="Celular">
              <Input placeholder="Ingrese el celular del empleado" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="allergies"
              label="Alergias"
            >
              <Input placeholder="Ingrese la CURP del empleado" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="blood_type"
              label="Tipo de sangre"
            >
              <Select placeholder="Seleccione el tipo de sangre">
                <Select.Option value="A+">A+</Select.Option>
                <Select.Option value="A-">A-</Select.Option>
                <Select.Option value="B+">B+</Select.Option>
                <Select.Option value="B-">B-</Select.Option>
                <Select.Option value="AB+">AB+</Select.Option>
                <Select.Option value="AB-">AB-</Select.Option>
                <Select.Option value="O+">O+</Select.Option>
                <Select.Option value="O-">O-</Select.Option>

              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="nss"
              label="NSS"
            >
              <Input placeholder="Ingrese el NSS del empleado" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="cuip"
              label="CUIP"
            >
              <Input placeholder="Ingrese el CUIP del empleado" />
            </Form.Item>
          </Col>
        </Row>



      </Form>
    </Drawer>
  )
}
