// import { useParams } from 'react-router-dom';
// import { useUser } from '../../../hooks/user';
// import { notification, Tabs } from 'antd';
// import { TabBinnacle } from './components/TabBinnacle';
// import { TabGeneral } from './components/TabGeneral';
// import { HolidayUser } from '../holidays/HolidayUser';
// import { TabFiles } from './components/TabFiles';


export default function ViewUser() {

    // const { id = '' } = useParams();
    // const [api, contextHolder] = notification.useNotification();
    // const { data, refetch } = useUser(id!);

    return (
        <>
            {/* {contextHolder}

            <Tabs
                defaultActiveKey='1'
                items={[
                    {
                        key: '1',
                        label: 'Información general',
                        children: <TabGeneral user={data} refetch={refetch} />
                    },
                    {
                        key: '2',
                        label: 'Historial de movimientos',
                        children: <TabBinnacle id={data?.user_id} />
                    },
                    {
                        key: '3',
                        label: 'Vacaciones',
                        children: <HolidayUser id={data?.user_id} />
                    },
                    {
                        key: '4',
                        label: 'Archivos',
                        children: <TabFiles id={data?.user_id} api={api} />
                    }
                ]}
            /> */}

        </>
    )
}
