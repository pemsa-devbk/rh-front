import { useEmployee } from '../../../../hooks/employee';
import { Alert, Button, Descriptions, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Gender, MaritalStatus } from '../../../../api/interfaces/employee';
import dayjs from '../../../../helpers/dayjs'
interface Props {
    employeeID: string;
    openModal: (key: string) => void;
    modalkey: string;
}

export const InfoBasic = ({ employeeID, openModal, modalkey }: Props) => {
    const { data, isSuccess } = useEmployee(employeeID);

     if (!isSuccess)
        return <>
            <Typography.Title level={5}>Información basica</Typography.Title>
            <Alert type='error' message='Error al obtener información del empleado' />
        </>;

    return (
        <Descriptions
            size='small'
            column={3}
            layout='vertical'
            extra={<Button type='text' onClick={() => openModal(modalkey)} icon={<EditOutlined />} />}
            title='Información basica'
            items={[
                { label: 'No. Empleado', children: data?.user_id },
                { label: 'Nombre', children: data?.name },
                { label: 'Correo', children: data?.email },
                { label: 'Telefono', children: data?.cell_phone },
                { label: 'Fecha de nacimiento', children: dayjs(data?.birthdate).format('DD [de] MMMM [de] YYYY') },
                { label: 'Genero', children: data?.gender === Gender.MASCULINO ? 'Masculino' : 'Femenino' },
                { label: 'CURP', children: data?.curp },
                { label: 'RFC', children: data?.rfc },
                { label: 'CUIP', children: data?.cuip },
                { label: 'Numero de hijos', children: data?.num_children },
                { label: 'Estado civil', children: (data?.marital_status === MaritalStatus.SINGLE) ? 'Soltero(a)' : (data?.marital_status === MaritalStatus.MARRIED) ? 'Casado(a)' : (data?.marital_status === MaritalStatus.DIVORCED) ? 'Divorciado(a)' : (data?.marital_status === MaritalStatus.WIDOWER) ? 'Viudo(a)' : 'Concubinato' },
                { label: 'Lugar de registro', children: data?.place_registration },
                { label: 'CP CSF', children: data?.cp_csf },
                { label: 'Pensión alimenticia', children: data?.have_alimony ? 'Si' : 'No' },
                { label: 'No. Credito infonavit', children: data?.num_infonavit },
                { label: 'No. Credito fonacot', children: data?.cred_fonacot },
            ]}
        />
    )
}
