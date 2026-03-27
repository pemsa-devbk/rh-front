import { FormUser, User } from '../../../../api/interfaces/user';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space } from 'antd';
import { useRoles } from '../../../../hooks/general';
import { useInfiniteUsers, useUpDateUser } from '../../../../hooks/user';
import { useEffect, useState } from 'react';
import { getUpdatedFields } from '../../../../helpers/getUpdateFields';
import { parseuserToForm } from '../../../../helpers/userToFormUser';
import { useInfiniteAreasByDepartment as  useInfiniteAreasByOffice } from '../../../../hooks/area';
import { useInfinitePositionsByArea } from '../../../../hooks/position';
import { useInfiniteOfficesByEnterprice } from '../../../../hooks/office';
import { useInfiniteEnterprises } from '../../../../hooks/enterprise';
import { Enterprise } from '../../../../api/interfaces/enterprise';
import { Office } from '../../../../api/interfaces/office';
import { Area } from '../../../../api/interfaces/area';
import { SelectWithSearch } from '../../../../components/SelectWithSearch';
import { Position } from '../../../../api/interfaces/position';

interface Props {
    user?: User;
    open: boolean;
    onClose: () => void;
}

export const ModalEdit = ({ user, onClose, open }: Props) => {

    const { data: roles } = useRoles();
    const { mutate } = useUpDateUser(() => {
        form.resetFields();
        onClose();
    });
    const [form] = Form.useForm<FormUser>();

    const [search, setSearch] = useState({
        enterprise: '', office: '', area: '', position: '', user: ''
    });

    const [selectedValue, setSelectedValue] = useState({
        enterprise: '',
        office: NaN,
        area: NaN,
    });

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteUsers(open, '');
    const { data: dataEnterprise, fetchNextPage: fetchNextPageEnterprise, hasNextPage: hasNextPageEnterprise, isFetchingNextPage: isFetchingNextPageEnterprise, isFetching: isFetchingEnterprise } = useInfiniteEnterprises(open, search.enterprise);
    const { data: dataOffices, fetchNextPage: fetchNextPageOffices, hasNextPage: hasNextPageOffices, isFetchingNextPage: isFetchingNextPageOffices, isFetching: isFetchingOffices } = useInfiniteOfficesByEnterprice(selectedValue.enterprise, (open && !!selectedValue.enterprise), search.office);
    const { data: dataAreas, fetchNextPage: fetchNextPageAreas, hasNextPage: hasNextPageAreas, isFetchingNextPage: isFetchingNextPageAreas, isFetching: isFetchingAreas } = useInfiniteAreasByOffice(selectedValue.office, (open && !!selectedValue.office), search.area);
    const { data: dataPositions, fetchNextPage: fetchNextPagePositions, hasNextPage: hasNextPagePositions, isFetchingNextPage: isFetchingNextPagePositions, isFetching: isFetchingPositions } = useInfinitePositionsByArea(selectedValue.area, (open && !!selectedValue.area), search.position);


    const handleFormSubmit = (values: FormUser) => {
        const userParse = parseuserToForm(user!);
        const changes = getUpdatedFields(userParse, values);
        mutate({ data: changes, id: user!.user_id });
    }

    useEffect(() => {
        if (user && open) {
            const userParse = parseuserToForm(user);
            form.setFieldsValue(userParse);
            // setSelectedValue((old) => ({
            //     enterprise: user.position?.area?.office?.enterprise.enterprise_id || '',
            //     office: user.position?.area?.office?.office_id || NaN,
            //     area: user.position?.area?.area_id || NaN,
            // }))
        }
    }, [user, open])

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
            title={`Editar empleado`}
            width={720}
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
            <Form form={form} onFinish={handleFormSubmit} layout="vertical" id='frm-add-employee'>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="user_id"
                            label="ID de empleado"
                        >
                            <Input placeholder="Ingrese el número de empleado" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Nombre"
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
                        >
                            <DatePicker style={{ width: '100%' }} format={'YYYY-MM-DD'} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="birthdate"
                            label="Fecha de nacimiento"
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
                            placeHolder={"Seleccione la empresa"}
                            fetchNextPage={fetchNextPageEnterprise}
                            loading={isFetchingNextPageEnterprise || isFetchingEnterprise}
                            hasNextPage={hasNextPageEnterprise}
                            isFetchingNextPage={isFetchingNextPageEnterprise}
                            labelKey='name'
                            valueKey='enterprise_id'
                            items={dataEnterprise}
                            setSearch={(value) => handleSearch('enterprise', value)}
                            required
                            onChange={(value) => handleChangeValue('enterprise', value)}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectWithSearch<Office>
                            label="Oficina"
                            name="office_id"
                            disabled={!selectedValue.enterprise}
                            placeHolder={"Seleccione la oficina"}
                            fetchNextPage={fetchNextPageOffices}
                            loading={isFetchingNextPageOffices || isFetchingOffices}
                            hasNextPage={hasNextPageOffices}
                            isFetchingNextPage={isFetchingNextPageOffices}
                            labelKey='name'
                            valueKey='office_id'
                            items={dataOffices}
                            setSearch={(value) => handleSearch('office', value)}
                            required
                            onChange={(value) => handleChangeValue('office', value)}
                        />

                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <SelectWithSearch<Area>
                            label="Area"
                            name="area_id"
                            disabled={!selectedValue.office}
                            placeHolder={"Seleccione la oficina"}
                            fetchNextPage={fetchNextPageAreas}
                            loading={isFetchingNextPageAreas || isFetchingAreas}
                            hasNextPage={hasNextPageAreas}
                            isFetchingNextPage={isFetchingNextPageAreas}
                            labelKey='name'
                            valueKey='area_id'
                            items={dataAreas}
                            setSearch={(value) => handleSearch('area', value)}
                            required
                            onChange={(value) => handleChangeValue('area', value)}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectWithSearch<Position>
                            label="Puesto"
                            name="position_id"
                            disabled={!selectedValue.area}
                            placeHolder={"Seleccione el puesto"}
                            fetchNextPage={fetchNextPagePositions}
                            loading={isFetchingNextPagePositions || isFetchingPositions}
                            hasNextPage={hasNextPagePositions}
                            isFetchingNextPage={isFetchingNextPagePositions}
                            labelKey='name'
                            valueKey='position_id'
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
