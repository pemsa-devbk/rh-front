import { Avatar, Badge, Button, Col, Flex, Form, GetProp, Image, Result, Row, Skeleton, Space, Typography, Upload, UploadFile, UploadProps } from 'antd'
import { useGetFiles } from '../../../../hooks/file'
import { instance } from '../../../../api/rh';
import { useCallback, useRef, useState } from 'react';
import { ProfileImageUpload } from '../../../../components/ProfileImageUpload';
import { fallbackImage } from '../../../../helpers/fallback-img';
import { CameraFilled, CameraOutlined } from '@ant-design/icons';
import { SignatureImageUpload } from '../../../../components/SignatureImageUpload';


export const FormDocuments = () => {
    const { data, isLoading, isError, error } = useGetFiles();

    const handleCustomRequest = useCallback(async (options: any, fileID: number, key: string) => {
        const { file, onSuccess, onError } = options;
        const formData = new FormData();
        formData.append(key, file);

        try {
            await instance.post(`files/${fileID}/employees/${21061}`, formData);
            onSuccess();
        } catch (err) {
            onError(err);
        }
    }, []);


    if (isLoading) return <Skeleton active />;
    if (isError && error) return <Result status='error' title='ocurrio un error' subTitle={error.message} />




    return (
        <>
            <Row gutter={[16, 16]}>
                
                <Col xs={{offset: 1}}>
                    <Typography.Title level={5}>Archivos</Typography.Title>
                    <Flex vertical gap={10}>
                        {
                            data?.map(file => (
                                <Form.Item
                                rules={[{required: file.is_required, message: 'Archivo requerido'}]}
                                >
                                    <Upload maxCount={1} accept={file.valid_mime_types}>
                                        <Button>Subir {file.name}</Button>
                                    </Upload>
                                </Form.Item>
                            ))
                        }
                    </Flex>
                </Col>
            </Row>
            {/* <div style={{ width: 200, height: 200 }}>

            </div> */}

            {/* <div style={{ width: 200, height: 100 }}>
                
            </div> */}

        </>
    )
}

