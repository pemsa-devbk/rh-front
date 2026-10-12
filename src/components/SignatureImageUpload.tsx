import { CameraFilled } from '@ant-design/icons';
import { Button, Col, Flex, Image, Modal, Row, Slider, Space, Upload } from 'antd';
import { useCallback, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import getCroppedImg, { getMimeTypeFromDataUrl, PixelCrop } from '../helpers/getCroppedImg';
import { fallbackImage2 } from '../helpers/fallback-img';

interface Props {
    aspect: number;
    showGrid?: boolean;
    showZoomSlider?: boolean;
    showRotationSlider?: boolean;
    showReset?: boolean;
    handleImage: (key: string, file: File) => void
}
interface ImageInfo {
    src: string | null;
    mimeType: string;
    originalFile: File | null;
    cropFile: string | null;
}

export const SignatureImageUpload = ({ aspect, showGrid, showReset, showRotationSlider, showZoomSlider, handleImage }: Props) => {

    const [imageInfo, setImageInfo] = useState<ImageInfo>({
        src: null,
        mimeType: 'image/jpeg',
        originalFile: null,
        cropFile: null
    });
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
        setImageInfo({ src: null, mimeType: 'image/jpeg', originalFile: null, cropFile: null });
        setRotation(0);
        setZoom(1);
    };
    const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // * Upload
    const beforeUpload = (file: File): boolean => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const dataUrl = reader.result as string;
            const mimeType = getMimeTypeFromDataUrl(dataUrl);
            setImageInfo({
                src: dataUrl,
                mimeType,
                originalFile: file,
                cropFile: null
            });
            setIsModalVisible(true);
        };
        return false;
    }

    const handleCropAndUpload = async () => {
        if (!imageInfo.src || !croppedAreaPixels) return;

        setIsLoading(true);
        try {
            const croppedImageBlob = await getCroppedImg(
                imageInfo.src,
                croppedAreaPixels,
                rotation,
                { horizontal: false, vertical: false },
                imageInfo.mimeType // Pasar el tipo MIME original
            );

            if (!croppedImageBlob) {
                throw new Error('Error al recortar la imagen');
            }
            const getFileExtension = (mimeType: string): string => {
                const extensions: { [key: string]: string } = {
                    'image/png': 'png',
                };
                return extensions[mimeType] || 'png';
            };

            const extension = getFileExtension(imageInfo.mimeType);
            const originalName = imageInfo.originalFile?.name || 'image';
            const nameWithoutExt = originalName.replace(/\.[^/.]+$/, ""); // Remover extensión existente

            const finalImageFile = new File(
                [croppedImageBlob],
                `${nameWithoutExt}.${extension}`,
                { type: imageInfo.mimeType }
            );

            handleImage('IMG_FIRMA', finalImageFile);

            // * Poner imagen
            const reader = new FileReader();
            reader.readAsDataURL(finalImageFile);
            reader.onload = () => {
                const dataUrl = reader.result as string;
                setImageInfo((old) => ({ ...old, cropFile: dataUrl }));
            };

            // const formData = new FormData();
            // formData.append(keyFile, finalImageFile);
            // await instance.post(url, formData);
            // message.success(`Imagen subida con éxito!`);

            setIsModalVisible(false);


        } catch (error) {
            // message.error('Error al procesar la imagen');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Flex align='center' justify='center' style={{ height: '100%', position: 'relative' }}>
                <Image
                    alt='signature-photo'
                    height='100%'
                    width='100%'
                    src={imageInfo.cropFile || ''}
                    fallback={fallbackImage2}
                />
                <Upload
                    beforeUpload={beforeUpload}
                    maxCount={1}
                    accept="image/png"
                    showUploadList={false}
                    // listType='picture-circle'
                    style={{ height: '100%', background: 'red' }}
                >
                    <Button
                        style={{
                            position: 'absolute',
                            display: 'block',
                            width: '25%',
                            height: '50%',
                            borderRadius: '50%',
                            border: '.3em solid #fff',
                            right: '0',
                            bottom: '0',
                        }}
                        size='large' type="primary" shape="circle" icon={<CameraFilled />} />
                </Upload>
            </Flex>

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
                {imageInfo.src && (
                    <div style={{ marginBottom: 16 }}>
                        {/* Controles de rotación y zoom */}

                        <div style={{ position: 'relative', width: '100%', height: 400, background: '#f0f0f0' }}>
                            <Cropper
                                image={imageInfo.src}
                                crop={crop}
                                zoom={zoom}
                                aspect={aspect}
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
                )}
            </Modal>
        </>

    )
}
