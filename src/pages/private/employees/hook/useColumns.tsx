import { Button, Space, TableProps, Tooltip } from "antd";
import { Employee, Gender } from '../../../../api/interfaces/employee';
import { useCallback, useMemo } from "react";
import dayjs from "dayjs";
import { NavLink } from "react-router-dom";
import { DeleteOutlined, DownloadOutlined, EditOutlined, EyeOutlined, SignatureOutlined } from "@ant-design/icons";

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
    setSelectedEmployee: React.Dispatch<React.SetStateAction<Employee | undefined>>;
    toggleModal: (key: string) => void;
    context: EmployeeContext;
}

const VISIBLE_CONTEXTS: Record<string, EmployeeContext[]> = {
  enterprise_name: [EmployeeContext.FROM_GENERAL],
  office_name:     [EmployeeContext.FROM_GENERAL, EmployeeContext.FROM_ENTERPRISE],
  department_name: [EmployeeContext.FROM_GENERAL, EmployeeContext.FROM_ENTERPRISE, EmployeeContext.FROM_OFFICE],
  area_name:       [EmployeeContext.FROM_GENERAL, EmployeeContext.FROM_ENTERPRISE, EmployeeContext.FROM_OFFICE, EmployeeContext.FROM_DEPARTMENT],
  position_name:   [EmployeeContext.FROM_GENERAL, EmployeeContext.FROM_ENTERPRISE, EmployeeContext.FROM_OFFICE, EmployeeContext.FROM_DEPARTMENT, EmployeeContext.FROM_AREA],
};

export const useColumns = ({ setSelectedEmployee, toggleModal, context = EmployeeContext.FROM_GENERAL }: Props): TableProps<Employee>['columns'] => {
    
    const handleEdit = useCallback((employee: Employee) => {
        setSelectedEmployee(employee);
        toggleModal('edit');
    }, [setSelectedEmployee, toggleModal]);

    return useMemo<TableProps<Employee>['columns']>( () => [
        { title: 'Num. Empleado', dataIndex: 'user_id', key: 'employee_id'},
        { title: 'Nombre', dataIndex: 'name', key: 'employee_name'},
        { title: 'Empresa', dataIndex: 'enterprise_name', key: 'employee_enterprise', hidden: !VISIBLE_CONTEXTS['enterprise_name'].includes(context)},
        { title: 'Oficina', dataIndex: 'office_name', key: 'employee_office', hidden: !VISIBLE_CONTEXTS['office_name'].includes(context)},
        { title: 'Departamento', dataIndex: 'department_name', key: 'employee_department', hidden: !VISIBLE_CONTEXTS['department_name'].includes(context)},
        { title: 'Area', dataIndex: 'area_name', key: 'employee_area', hidden: !VISIBLE_CONTEXTS['area_name'].includes(context)},
        { title: 'Puesto', dataIndex: 'position_name', key: 'employee_position', hidden: !VISIBLE_CONTEXTS['position_name'].includes(context)},
        {title: 'Genero', dataIndex: 'gender', key: 'employee_gender',
            render(value: Gender) {
                return <span>{(value == Gender.MASCULINO) ? 'MASCULINO' : 'FEMENINO'}</span>
            },
        },
        {title: 'Días de vacaciones', dataIndex: 'vacation_days', key: 'employee_vacation',
            render(value: number) {
                return <span>{value} {(value == 1 || value == -1) ? 'Día' : 'Días'}</span>
            },
        },
        {title: 'Fecha de ingreso', dataIndex: 'date_entry', key: 'employee_date_entry', 
            render(value: string) {
                return <span>{dayjs(value).format('YYYY-MM-DD')}</span>
            },
        },
        {title: 'Acciones', key: 'employee_actions',
            render(_, record) {
                return <Space wrap>
                    <NavLink to={`/dashboard/employees/${record.user_id}`}>
                        <Tooltip title='Detalles'>
                            <Button color='cyan' variant='outlined' icon={<EyeOutlined />} />
                        </Tooltip>
                    </NavLink>
                    <Tooltip title='Editar'>
                        <Button color='gold' variant='outlined' icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    </Tooltip>
                    <Tooltip title='Descargar credencial'>
                        <Button color='green' variant='outlined' icon={<DownloadOutlined />} />
                    </Tooltip>
                    <Tooltip title='Descargar firma (correo)'>
                        <Button color='lime' variant='outlined' icon={<SignatureOutlined />} />
                    </Tooltip>
                    <Tooltip title='Dar de  baja'>
                        <Button danger variant='outlined' icon={<DeleteOutlined />} />
                    </Tooltip>
                </Space>
            },
        }
    ] , [context, setSelectedEmployee, toggleModal]);
}
