import { Button, DatePicker, message, Popconfirm, Space, TableProps, Tooltip, Typography } from "antd";
import { Employee, Gender, MaritalStatus } from '../../../../api/interfaces/employee';
import { useCallback, useMemo, useState } from "react";
import dayjs from "dayjs";
import { NavLink } from "react-router-dom";
import { DeleteOutlined, DownloadOutlined, EyeOutlined, ReloadOutlined,  SignatureOutlined } from "@ant-design/icons";
import { donwloadCredential, donwloadSignature, reloadSignature } from "../../../../api/file";
import { createColumnFilterText } from "../../../../components/table/createColumnFilterText";

export enum EmployeeContext {
    FROM_ENTERPRISE = 'FROM_ENTERPRISE', // Desde /enterprises/:id/employees -> Office + department + area + position + employee
    FROM_OFFICE = 'FROM_OFFICE', // Desde offices/:id/employees -> department + area + position + employee
    FROM_DEPARTMENT = 'FROM_DEPARTMENT', // Desde departments/:id/employees -> area + position + employee
    FROM_AREA = 'FROM_AREA', // Desde areas/:id/employees -> position + employee
    FROM_POSITION = 'FROM_POSITION', // Desde positions/:id/employees -> employee
    FROM_COURSE = 'FROM_COURSE', // Desde course/:id/courses -> employee
    FROM_GENERAL = 'FROM_GENERAL' // Desde /employees -> enterpise + Office + department + area + position + employee
}

interface Props {
    context: EmployeeContext;
}

const VISIBLE_CONTEXTS: Record<string, EmployeeContext[]> = {
    enterprise_name: [EmployeeContext.FROM_GENERAL],
    office_name: [EmployeeContext.FROM_GENERAL, EmployeeContext.FROM_ENTERPRISE],
    department_name: [EmployeeContext.FROM_GENERAL, EmployeeContext.FROM_ENTERPRISE, EmployeeContext.FROM_OFFICE],
    area_name: [EmployeeContext.FROM_GENERAL, EmployeeContext.FROM_ENTERPRISE, EmployeeContext.FROM_OFFICE, EmployeeContext.FROM_DEPARTMENT],
    position_name: [EmployeeContext.FROM_GENERAL, EmployeeContext.FROM_ENTERPRISE, EmployeeContext.FROM_OFFICE, EmployeeContext.FROM_DEPARTMENT, EmployeeContext.FROM_AREA],
};

export const useColumns = ({ context = EmployeeContext.FROM_GENERAL }: Props): TableProps<Employee>['columns'] => {
    const [year, setYear] = useState(dayjs())
    const handleDonwloadCredential = useCallback((employee: Employee) => {
        donwloadCredential(employee.user_id, year.format('YYYY'))
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `Credencial-${employee.name}.pdf`);
                document.body.appendChild(link);
                link.click()
            })
            .catch(error => {
                message.error(error.message ? `${error.message}` : 'Error al descargar comuniquese con un administrador');
            })
    }, [year]);

    const handleDonwloadSignature = useCallback((employee: Employee) => {
        donwloadSignature(employee.user_id)
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `Firma-${employee.name}.png`);
                document.body.appendChild(link);
                link.click()
            })
            .catch(error => {
                message.error(error.message ? `${error.message}` : 'Error al descargar comuniquese con un administrador');
            })
    }, []);

    const handleReloadSignature = useCallback((employee: Employee) => {
        reloadSignature(employee.user_id)
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `Firma-${employee.name}.png`);
                document.body.appendChild(link);
                link.click()
            })
            .catch(error => {
                message.error(error.message ? `${error.message}` : 'Error al descargar comuniquese con un administrador');
            })
    }, []);

    return useMemo<TableProps<Employee>['columns']>(() => [
        {
            dataIndex: 'user_id', ...createColumnFilterText('user_id', 'Num.Empleado'), sorter: true
        },
        { dataIndex: 'name', ...createColumnFilterText('name', 'Nombre'), sorter: true },
        { title: 'Empresa', dataIndex: 'enterprise_name', key: 'enterprise_name', hidden: !VISIBLE_CONTEXTS['enterprise_name'].includes(context) },
        { title: 'Oficina', dataIndex: 'office_name', key: 'office_name', hidden: !VISIBLE_CONTEXTS['office_name'].includes(context) },
        { title: 'Departamento', dataIndex: 'department_name', key: 'department_name', hidden: !VISIBLE_CONTEXTS['department_name'].includes(context) },
        { title: 'Area', dataIndex: 'area_name', key: 'area_name', hidden: !VISIBLE_CONTEXTS['area_name'].includes(context) },
        { title: 'Puesto', dataIndex: 'position_name', key: 'position_name', hidden: !VISIBLE_CONTEXTS['position_name'].includes(context) },
        {
            title: 'Genero', dataIndex: 'gender', key: 'gender',
            render(value: Gender) {
                return <span>{(value == Gender.MASCULINO) ? 'MASCULINO' : 'FEMENINO'}</span>
            },
        },
        {
            title: 'Días de vacaciones', dataIndex: 'vacation_days', key: 'vacation_days',
            render(value: number) {
                return <span>{value ? value : 0} {(value && value == 1) ? 'Día' : 'Días'}</span>
            },
        },
        {
            title: 'Fecha de ingreso', dataIndex: 'date_entry', key: 'date_entry',
            render(value: string) {
                return <span>{dayjs(value).format('YYYY-MM-DD')}</span>
            },
        },
        {
            title: 'Fecha de nacimiento', dataIndex: 'birthdate', key: 'birthdate',
            render(value: string) {
                return <span>{dayjs(value).format('YYYY-MM-DD')}</span>
            },
        },
        { title: 'CURP', dataIndex: 'curp', key: 'curp' },
        { title: 'RFC', dataIndex: 'rfc', key: 'rfc' },
        { title: 'CUIP', dataIndex: 'cuip', key: 'cuip' },
        { title: 'Número de hijos', dataIndex: 'num_children', key: 'num_children' },
        {
            title: '¿Uniforme?', dataIndex: 'have_uniform', key: 'have_uniform',
            render(value) {
                return <Typography.Text>{value ? 'SI' : 'NO'}</Typography.Text>
            }
        },
        { title: 'Num. Infonavit', dataIndex: 'num_infonavit', key: 'num_infonavit' },
        {
            title: 'Estado civil', dataIndex: 'marital_status', key: 'marital_status',
            render(value: MaritalStatus) {
                return <Typography.Text>
                    {
                        !value ? 'No asignado'
                        :value === MaritalStatus.SINGLE
                            ? 'Soltero'
                            : value === MaritalStatus.MARRIED
                                ? 'Casado'
                                : value === MaritalStatus.DIVORCED
                                    ? 'Divorciado'
                                    : value === MaritalStatus.CONCUBINAGE
                                        ? 'Concubinato'
                                        : 'Vuido'
                    }
                </Typography.Text>
            }
        },
        { title: 'Lugar de reistro', dataIndex: 'place_registration', key: 'place_registration' },
        { title: 'Salario', dataIndex: 'salary', key: 'salary' },
        { title: 'CP CSF', dataIndex: 'cp_csf', key: 'cp_csf' },
        { title: 'Correo', dataIndex: 'email', key: 'email' },
        { title: 'Celular', dataIndex: 'cell_phone', key: 'cell_phone' },
        { title: '¿Pensión alimenticia?', dataIndex: 'have_alimony', key: 'have_alimony' },
        { title: 'Num. Fonacot', dataIndex: 'cred_fonacot', key: 'cred_fonacot' },
        { title: 'Jefe directo', dataIndex: 'boss_name', key: 'boss_name' },
        { title: 'Días de vacaciones', dataIndex: 'vacation_days', key: 'vacations_days' },

        {
            title: 'Acciones', key: 'employee_actions',
            render(_, record) {
                return <Space wrap>
                    <NavLink to={`/dashboard/employees/${record.user_id}`}>
                        <Tooltip title='Detalles'>
                            <Button color='cyan' variant='outlined' icon={<EyeOutlined />} />
                        </Tooltip>
                    </NavLink>

                    <Tooltip title='Descargar credencial'>
                        <Popconfirm
                            title="Vigencia"
                            description={<DatePicker allowClear={false} picker="year" value={year} onChange={(e) => setYear(() => e)} />}
                            onConfirm={() => handleDonwloadCredential(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button color='green' variant='outlined' icon={<DownloadOutlined />} />
                        </Popconfirm>
                    </Tooltip>
                    <Tooltip title='Descargar firma (correo)'>
                        <Button onClick={() => handleDonwloadSignature(record)} color='lime' variant='outlined' icon={<SignatureOutlined />} />
                    </Tooltip>
                    <Tooltip title='Actualizar Firma (correo)'>
                        <Button onClick={() => handleReloadSignature(record)} color='yellow' variant='outlined' icon={<ReloadOutlined />} />
                    </Tooltip>
                    <Tooltip title='Dar de  baja'>
                        <Button danger variant='outlined' icon={<DeleteOutlined />} />
                    </Tooltip>
                </Space>
            },
        }
    ], [context, year]);
}
