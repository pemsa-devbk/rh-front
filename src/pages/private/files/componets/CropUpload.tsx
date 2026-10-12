import { UploadOutlined } from '@ant-design/icons';
import { Button, Modal, Upload, Row, Col, Space, Slider, message } from 'antd';
import { useCallback, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop';
import getCroppedImg, { getMimeTypeFromDataUrl, PixelCrop } from '../../../../helpers/getCroppedImg';
import { FileEmployee } from '../../../../api/interfaces/file';
import { uploadFile } from '../../../../api/file';

interface Props {
    showGrid?: boolean;
    showZoomSlider?: boolean;
    showRotationSlider?: boolean;
    showReset?: boolean;
    fileEmployee: FileEmployee;
    employeeID: string;
}
export const CropUpload = ({ fileEmployee: { aspect_ratio, valid_mime_types, key }, showGrid, showReset, showRotationSlider, showZoomSlider, employeeID }: Props) => {
    const [image, setImage] = useState<string>();
    const [mimeType, setMimeType] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);

    // * Modal controls
    const [isModalVisible, setIsModalVisible] = useState(false);

    // * Basic controllers
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);

    // * basics handles
    const resetChanges = () => {
        setRotation(0);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
    }
    const handleCancel = () => {
        setIsModalVisible(false);
        setImage(undefined);
        setRotation(0);
        setZoom(1);
    };
    const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const beforeUpload = (file: File): boolean => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const dataUrl = reader.result as string;
            setMimeType(getMimeTypeFromDataUrl(dataUrl));
            setImage(dataUrl);
            setIsModalVisible(true);
        };
        return false;
    }

    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append(key, file);
        await uploadFile({ employeeID, body: formData })
    }

    const handleCropAndUpload = async () => {
        if (!image || !croppedAreaPixels) return;

        setIsLoading(true);
        try {
            const croppedImageBlob = await getCroppedImg(
                image,
                croppedAreaPixels,
                rotation,
                { horizontal: false, vertical: false },
                mimeType // Pasar el tipo MIME original
            );
            if (!croppedImageBlob) throw new Error('Error al recortar la imagen');
            const getFileExtension = (mimeType: string): string => {
                const extensions: { [key: string]: string } = {
                    'image/jpeg': 'jpg',
                    'image/png': 'png'
                };
                return extensions[mimeType] || 'jpg';
            };

            const extension = getFileExtension(mimeType!);
            const originalName = 'image';
            const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");

            const finalImageFile = new File(
                [croppedImageBlob],
                `${nameWithoutExt}.${extension}`,
                { type: mimeType }
            );
            handleUpload(finalImageFile);
            setIsModalVisible(false);
            message.success('Archivo actualizado');
        } catch (error) {
            message.error('Error al subir el archivo');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Upload
                maxCount={1}
                accept={valid_mime_types}
                showUploadList={false}
                beforeUpload={beforeUpload}
            >
                <Button size='small' variant='filled' color='blue' icon={<UploadOutlined />} />
            </Upload>

            <Modal
                title="Recortar imagen"
                open={isModalVisible}
                width={700}
                okText="Recortar y Guardar"
                cancelText="Cancelar"
                confirmLoading={isLoading}
                footer={[
                    showReset && <Button key="back" onClick={resetChanges}>
                        Reiniciar
                    </Button>,
                    <Button onClick={handleCancel}>Cancelar</Button>,
                    <Button key="submit" type="primary" onClick={handleCropAndUpload} >
                        {/* loading={loading}  */}
                        Submit
                    </Button>,
                ]}
            >

                <div style={{ marginBottom: 16 }}>
                    {/* Controles de rotación y zoom */}

                    <div style={{ position: 'relative', width: '100%', height: 400, background: '#f0f0f0' }}>
                        <Cropper
                            image={image}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspect_ratio}
                            rotation={rotation}
                            showGrid={showGrid}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                        />
                    </div>
                    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                        <Col span={24}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                {
                                    showZoomSlider &&
                                    <div>
                                        <strong>Zoom:</strong>
                                        <Slider
                                            min={1}
                                            max={3}
                                            step={0.1}
                                            value={zoom}
                                            onChange={(value) => setZoom(value)}
                                        />
                                    </div>
                                }
                                {
                                    showRotationSlider &&
                                    <div>
                                        <strong>Rotación: {rotation}°</strong>
                                        <Slider
                                            min={-180}
                                            max={180}
                                            value={rotation}
                                            onChange={(value) => setRotation(value)}
                                        />
                                    </div>
                                }
                            </Space>
                        </Col>
                    </Row>
                </div>

            </Modal>
        </>
    )
}
