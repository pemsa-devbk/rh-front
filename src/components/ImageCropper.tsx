import { useState, useCallback } from 'react';
import { Modal, Upload, Button, message, UploadFile, Slider, Space, Row, Col } from 'antd';
import { RotateLeftOutlined, RotateRightOutlined } from '@ant-design/icons';
import Cropper, { Area } from 'react-easy-crop';
import getCroppedImg, { getMimeTypeFromDataUrl, PixelCrop, resizeImage } from '../helpers/getCroppedImg';
import { updatePhoto } from '../api/user';

interface Props {
    text: string;
    aspect?: number;
    width: number;
    height: number;
    id?: string;
    setUpdatePhoto?: React.Dispatch<React.SetStateAction<{
        foto: string;
        firma: string;
    }>>
}

interface ImageInfo {
    src: string | null;
    mimeType: string;
    originalFile: File | null;
}

const ImageCropper = ({ text, aspect, width, height, id, setUpdatePhoto }: Props) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [imageInfo, setImageInfo] = useState<ImageInfo>({
        src: null,
        mimeType: 'image/jpeg',
        originalFile: null
    });
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Manejar la subida de imágenes antes de recortar
    const beforeUpload = (file: File): boolean => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Solo puedes subir archivos de imagen!');
            return false;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const dataUrl = reader.result as string;
            const mimeType = getMimeTypeFromDataUrl(dataUrl);

            setImageInfo({
                src: dataUrl,
                mimeType,
                originalFile: file
            });

            setFileList([{
                uid: file.name,
                name: file.name,
                status: 'done',
                url: dataUrl,
            }]);
            setIsModalVisible(true);
        };

        return false;
    };

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // Función para rotar la imagen
    const rotateImage = (degrees: number) => {
        setRotation((prevRotation) => (prevRotation + degrees) % 360);
    };

    // Recortar la imagen y redimensionar al tamaño exacto
    const handleCropAndUpload = async () => {
        if (!imageInfo.src || !croppedAreaPixels) return;

        setIsLoading(true);
        try {
            // 1. Obtener la imagen recortada como Blob manteniendo el formato original
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

            // 2. Redimensionar manteniendo el formato original
            const resizedImageBlob = await resizeImage(
                croppedImageBlob,
                width,
                height,
                imageInfo.mimeType // Mantener el formato original
            );

            // 3. Obtener la extensión correcta del archivo
            const getFileExtension = (mimeType: string): string => {
                const extensions: { [key: string]: string } = {
                    'image/jpeg': 'jpg',
                    'image/png': 'png',
                    'image/gif': 'gif',
                    'image/webp': 'webp',
                    'image/svg+xml': 'svg',
                    'image/bmp': 'bmp',
                    'image/tiff': 'tiff'
                };
                return extensions[mimeType] || 'jpg';
            };

            const extension = getFileExtension(imageInfo.mimeType);
            const originalName = imageInfo.originalFile?.name || 'image';
            const nameWithoutExt = originalName.replace(/\.[^/.]+$/, ""); // Remover extensión existente

            // 4. Crear File con el nombre y tipo correctos
            const finalImageFile = new File(
                [resizedImageBlob],
                `${nameWithoutExt}.${extension}`,
                { type: imageInfo.mimeType }
            );

            // 5. Preparar para enviar al backend
            const formData = new FormData();
            formData.append(text, finalImageFile);

            await updatePhoto(id!, text, formData);

            setUpdatePhoto && setUpdatePhoto((old) => ({...old, [text]: Date.now().toString()}))

            message.success(`Imagen subida con éxito!`);
            handleCancel();

        } catch (error) {
            message.error('Error al procesar la imagen');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setFileList([]);
        setImageInfo({ src: null, mimeType: 'image/jpeg', originalFile: null });
        setRotation(0);
        setZoom(1);
    };

    return (
        <div>
            <Upload
                fileList={fileList}
                beforeUpload={beforeUpload}
                onRemove={() => setFileList([])}
                maxCount={1}
                accept="image/*"
            >
                <Button type='text'>{text}</Button>
            </Upload>

            <Modal
                title="Recortar imagen"
                open={isModalVisible}
                onOk={handleCropAndUpload}
                onCancel={handleCancel}
                width={700}
                okText="Recortar y Guardar"
                cancelText="Cancelar"
                confirmLoading={isLoading}
            >
                {imageInfo.src && (
                    <div style={{ marginBottom: 16 }}>
                        {/* Controles de rotación y zoom */}
                        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                            <Col span={24}>
                                <Space direction="vertical" style={{ width: '100%' }}>
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

                                    <div>
                                        <strong>Rotación: {rotation}°</strong>
                                        <Slider
                                            min={-180}
                                            max={180}
                                            value={rotation}
                                            onChange={(value) => setRotation(value)}
                                        />
                                    </div>

                                    <Space>
                                        <Button
                                            icon={<RotateLeftOutlined />}
                                            onClick={() => rotateImage(-90)}
                                        >
                                            Rotar -90°
                                        </Button>
                                        <Button
                                            icon={<RotateRightOutlined />}
                                            onClick={() => rotateImage(90)}
                                        >
                                            Rotar +90°
                                        </Button>
                                        <Button onClick={() => setRotation(0)}>
                                            Reiniciar
                                        </Button>
                                    </Space>
                                </Space>
                            </Col>
                        </Row>

                        {/* Área de recorte */}
                        <div style={{ position: 'relative', width: '100%', height: 400, background: '#f0f0f0' }}>
                            <Cropper
                                image={imageInfo.src}
                                crop={crop}
                                zoom={zoom}
                                rotation={rotation}
                                aspect={aspect || 1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                                showGrid={true}
                                restrictPosition={false}
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ImageCropper;