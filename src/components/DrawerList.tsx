import { Drawer } from 'antd';
import { InfiniteList } from './InfiniteList';
import {Props as PropsList} from './InfiniteList'
import { ReactNode } from 'react';

interface Props<T> extends PropsList<T>{
    open: boolean;
    onClose: () => void;
    title: string;
    loading?: boolean;
    extraButtons?: ReactNode;
    children?: ReactNode;
}

export function DrawerList<T> ({ title, open, onClose, nextFn, hasMore, loader, endMessage, dataSource, itemKey, titleKey, descriptionKey, renderActions, loading, extraButtons, children }: Props<T>) {
    return (
        <Drawer
            title={title}
            open={open}
            onClose={onClose}
            loading={loading}
            extra={extraButtons}
        >
            {children}
            <InfiniteList
                hasMore={hasMore}
                itemKey={itemKey}
                loader={loader}
                nextFn={nextFn}
                titleKey={titleKey}
                dataSource={dataSource}
                descriptionKey={descriptionKey}
                endMessage={endMessage}
                renderActions={renderActions}
            />
        </Drawer>
    )
}
