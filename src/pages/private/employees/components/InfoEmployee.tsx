import { useEmployee } from '../../../../hooks/employee';
import { Alert, Button, Descriptions, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import dayjs from '../../../../helpers/dayjs'
interface Props {
    employeeID: string;
    openModal: (key: string) => void;
    modalKey: string;
}

export const InfoEmployee = ({ employeeID, openModal, modalKey }: Props) => {
    const { data, isSuccess } = useEmployee(employeeID);

     if (!isSuccess)
        return <>
            <Typography.Title level={5}>Información de puesto</Typography.Title>
            <Alert type='error' message='Error al obtener información del empleado' />
        </>;

    return (
        <Descriptions
            size='small'
            column={3}
            layout='vertical'
            extra={<Button type='text' onClick={() => openModal(modalKey)} icon={<EditOutlined />} />}
            title='Información de puesto'
            items={[
                { label: 'Empresa', children: data?.enterprise_name, span: 3 },
                { label: 'Oficina', children: data?.office_name },
                { label: 'Departamento', children: data?.department_name },
                { label: 'Area', children: data?.area_name },
                { label: 'Puesto', children: data?.position_name },
                { label: 'Jefe directo', children: data?.boss_name },
                { label: 'Fecha de ingreso', children:  dayjs(data?.date_entry).format('DD [de] MMMM [de] YYYY') },
                { label: 'Salario', children: data?.salary },
                { label: 'Uniforme', children: data?.have_uniform ? 'Si' : 'No' },
                { label: 'Días de vacaciones', children: data?.vacation_days },
            ]}
        />
    )
}
