import { Form, Select } from 'antd';
import { useEffect, useState } from 'react'
import { ResponsePagination } from '../api/interfaces/response';
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import { DefaultOptionType } from 'antd/es/select';

type InfiniteQueryHook<T> = (search: string, enabled: boolean) => UseInfiniteQueryResult<InfiniteData<ResponsePagination<T>>, unknown>;

interface Props<T> {
    disabled?: boolean;
    label: string;
    name: string;
    required?: boolean;
    placeHolder: string;
    labelKey: keyof T;
    valueKey: keyof T;
    useQuery: InfiniteQueryHook<T>;
    onChange?: (value: DefaultOptionType, option?: DefaultOptionType | DefaultOptionType[]) => void;
    mode?: 'multiple' | 'tags';
    allowClear?: boolean;
    labelInValue?: boolean;
}

export function SelectWithSearch<T>({ disabled, mode, label, name, required, placeHolder, labelKey, valueKey, labelInValue, onChange, allowClear, useQuery }: Props<T>) {
    const [inputValue, setInputValue] = useState('');
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setSearch(inputValue), 500);
        return () => clearTimeout(timer);
    }, [inputValue]);

    const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading } = useQuery(search, isOpen);

    return (
        <Form.Item
            label={label}
            name={name}
            rules={[{ required, message: 'El campo es obligatorio' }]}
        >
            <Select
                onDropdownVisibleChange={(open) => setIsOpen(open)}
                labelInValue={labelInValue}
                mode={mode}
                disabled={disabled}
                placeholder={placeHolder}
                onChange={onChange}
                showSearch
                onSearch={(value) => setInputValue(value)}
                onPopupScroll={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.scrollTop + target.offsetHeight >= target.scrollHeight - 10 && hasNextPage && !isFetchingNextPage) {
                        fetchNextPage();
                    }
                }}
                allowClear={allowClear}
                onClear={() => {
                    setInputValue('');
                    setSearch('');
                }}
                filterOption={false}
                loading={isLoading || isFetchingNextPage}
                options={
                    data?.pages.flatMap((page) =>
                        page.data.map((item) => ({
                            label: item[labelKey] as any,
                            value: item[valueKey] as any,
                        }))
                    )
                }
            ></Select>
        </Form.Item>
    )
}
