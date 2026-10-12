import { TableOutlined } from '@ant-design/icons';
import { Button, Checkbox, CheckboxOptionType, Popover, Radio } from 'antd'
import { ColumnTitle } from 'antd/es/table/interface';
import React, { useState } from 'react'

interface Props<T> {
    options: {
        label: ColumnTitle<T>;
        value: React.Key | undefined;
    }[] | undefined;
    checkedList: Array<React.Key | undefined> | undefined;
    onChange: (checkedList: React.Key[]) => void;
}
export function ManageColumns<T>({ options, checkedList, onChange }: Props<T>) {
    const [showAll, setShowAll] = useState(true);

    return (
        <Popover trigger='click'
            content={
                <>
                    <Radio.Group
                        block
                        options={[
                            { label: 'Activos', value: false },
                            { label: 'Todos', value: true },
                        ]}
                        defaultValue={true}
                        optionType="button"
                        buttonStyle="solid"
                        value={showAll}
                        onChange={(e) => { setShowAll(e.target.value) }}
                    />
                    <div style={{ marginTop: 10, maxHeight: '300px', overflowY: 'auto', padding: 5 }}>
                        <Checkbox.Group
                            style={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                            value={checkedList}
                            options={
                                (
                                    showAll
                                        ? options
                                        : options?.filter(opt =>
                                            checkedList?.includes(opt.value as React.Key)
                                        )
                                ) as CheckboxOptionType[]
                            }
                            onChange={(value) => {
                                onChange(value as string[]);
                            }}
                        />
                    </div>
                </>
            }
        >
            <Button icon={<TableOutlined />}>Columnas</Button>
        </Popover>
    )
}
