import { useState } from 'react'
import { useInfiniteBinnacleModified, useInfiniteBinnacleModifier } from '../../../../hooks/binnacle'
import { Alert, Radio, Timeline } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import dayjs from '../../../../helpers/dayjs'

interface Props {
    employeeID: string;
}

export const TabBinnacle = ({ employeeID }: Props) => {
    const [option, setOption] = useState(true);
    const { data: dataModified, isError: isErrorModified, fetchNextPage: fetchNextPageModified, hasNextPage: hasNextPageModified, isFetching: isFetchingModified } = useInfiniteBinnacleModified(employeeID, option);
    const { data: dataModifier, isError: isErrorModifier, fetchNextPage: fetchNextPageModifier, hasNextPage: hasNextPageModifier, isFetching: isFetchingModifier } = useInfiniteBinnacleModifier(employeeID, !option);

    
    if (isErrorModified || isErrorModifier)
        return <Alert type='error' message='Error al obtener información de movimientos' />;

    if ((!dataModified && option) || (!dataModifier && !option))
        return <Alert type='warning' message='No hay información registrada' />;

    return (
        <>
            <Radio.Group block options={[
                { label: 'Mis movimientos', value: true },
                { label: 'Movimientos realizados', value: false },
            ]} value={option} buttonStyle="solid" optionType="button" onChange={({ target }) => setOption(target.value)} />
            <br />
            <br />
            <InfiniteScroll
                dataLength={(option ? dataModified?.pages.flatMap(p => p.data).length : dataModifier?.pages.flatMap(p => p.data).length) || 0}
                next={option ? fetchNextPageModified : fetchNextPageModifier}
                hasMore={option ? hasNextPageModified : hasNextPageModifier}
                loader={option ? isFetchingModified : isFetchingModifier}
                // endMessage={endMessage}
                scrollableTarget="scrollableDiv"
            >

                {
                    option ?
                        <Timeline style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 5 }} mode='left' items={dataModified?.pages.flatMap(page => page.data.map(mov => ({
                            children: `${mov.type} por el usuario: ${mov.modifier_name}`,
                            color: (mov.type == 'Alta') ? 'blue' : (mov.type == 'Baja') ? 'red' : (mov.type == 'Edición') ? 'gray' : 'green',
                            label: dayjs(mov.created_at).format('ddd d MMM [de] YYYY[, a las] hh:mm A')
                        })
                        ))} />
                        :
                        <Timeline style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 5 }} mode='left' items={dataModifier?.pages.flatMap(page => page.data.map(mov => ({
                            children: `${mov.type} al usuario: ${mov.modified_name}`,
                            color: (mov.type == 'Alta') ? 'blue' : (mov.type == 'Baja') ? 'red' : (mov.type == 'Edición') ? 'gray' : 'green',
                            label: dayjs(mov.created_at).format('ddd d MMM [de] YYYY[, a las] hh:mm A')
                        })
                        ))} />
                }
            </InfiniteScroll>
        </>
    )
}
