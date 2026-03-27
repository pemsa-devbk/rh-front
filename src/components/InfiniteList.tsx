import { ReactNode } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { List} from 'antd';
import { InfiniteData } from '@tanstack/react-query';
import { ResponsePagination } from '../api/interfaces/response';

type KeyOrRender<T> = keyof T | ((item: T) => ReactNode);

export interface Props<T> {
  nextFn: () => any;
  hasMore: boolean;
  loader: ReactNode;
  endMessage?: ReactNode;
  dataSource?: InfiniteData<ResponsePagination<T>>;
  itemKey: keyof T;
  titleKey: KeyOrRender<T>;
  descriptionKey?: KeyOrRender<T>;
  renderActions?: (item: T) => ReactNode;
}

// ============= Helper para obtener valor =============
function getValue<T>(item: T, keyOrRender: KeyOrRender<T>): ReactNode {
    if (typeof keyOrRender === 'function') {
        return keyOrRender(item);
    }
    return String(item[keyOrRender]);
}

function getKey<T>(item: T, keyOrRender: keyof T | ((item: T) => string | number)): string | number {
    if (typeof keyOrRender === 'function') {
        return keyOrRender(item);
    }
    return item[keyOrRender] as string | number;
}

export function InfiniteList<T>({ nextFn, hasMore, loader, endMessage, dataSource, itemKey, titleKey, descriptionKey, renderActions }: Props<T>) {
  return (

    <InfiniteScroll
      dataLength={dataSource?.pages.flatMap(p => p.data).length || 0}
      next={nextFn}
      hasMore={hasMore}
      loader={loader}
      endMessage={endMessage}
      scrollableTarget="scrollableDiv"
    >
      <List
        dataSource={dataSource?.pages.flatMap(p => p.data)}
        renderItem={(item) => (
          <List.Item key={getKey(item, itemKey)}>
            <List.Item.Meta
              title={getValue(item, titleKey)}
              description={descriptionKey ? getValue(item, descriptionKey) : undefined}
            />
            {
              renderActions?.(item)
            }
          </List.Item>
        )}
      />
    </InfiniteScroll>
  )
}
