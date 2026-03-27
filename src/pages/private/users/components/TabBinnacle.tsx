import InfiniteScroll from 'react-infinite-scroll-component'
import { useBitacora } from '../../../../hooks/user';
import { Divider, Spin, Timeline } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/es'


interface Props{
    id?: string;
}
dayjs.locale('es');


export const TabBinnacle = ({id}: Props) => {
    const { data: binnacle, fetchNextPage, hasNextPage } = useBitacora(id);

    return (
        <InfiniteScroll
            dataLength={binnacle?.pages.flatMap(p => p.data).length || 0}
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={<Spin />}
            scrollableTarget="scrollableDiv"
            height={350}
            style={{ padding: '1rem' }}
            endMessage={<Divider plain>No hay mas datos</Divider>}
        >
            <Timeline mode='left' items={binnacle?.pages.flatMap(page => page.data.map(
                mov => ({
                    children: `${mov.type}. Por el usuario: ${mov.modifierUser.name}`,
                    color: (mov.type == 'Alta') ? 'blue' : (mov.type == 'Baja') ? 'red' : (mov.type == 'Edición') ? 'gray' : 'green',
                    label: dayjs(mov.created_at).format('dddd d MMMM [de] YYYY[, a las] hh:mm A')
                })
            ))} />
        </InfiniteScroll>
    )
}
