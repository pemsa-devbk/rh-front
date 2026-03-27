import { SearchOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import { useEffect, useState } from 'react'

interface Props {
    setSearch: (value: any) => void;
}
export const InputSearch = ({setSearch}:Props) => {

    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(inputValue);
        }, 2000);
        return () => clearTimeout(timer);
    }, [inputValue]);

    return (
        <Input onChange={({target}) => setInputValue(target.value)} placeholder='Buscar...' prefix={<SearchOutlined />} />
    )
}
