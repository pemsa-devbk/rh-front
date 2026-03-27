export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

export function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: PixelCrop,
  rotation: number = 0,
  flip: { horizontal: boolean; vertical: boolean } = { horizontal: false, vertical: false },
  mimeType: string = 'image/jpeg' // Nuevo parámetro para el tipo MIME
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.putImageData(data, 0, 0);

  // As Blob con el tipo MIME especificado
  return new Promise<Blob>((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        }
      },
      mimeType, // Usar el tipo MIME especificado
      0.9 // Calidad (solo aplica para JPEG)
    );
  });
}

// Agrega esta función al final de tu archivo getCroppedImg.ts
export async function resizeImage(
  imageBlob: Blob,
  targetWidth: number,
  targetHeight: number,
  mimeType: string = 'image/jpeg' // Nuevo parámetro
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(imageBlob);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('No se pudo obtener el contexto del canvas'));
        return;
      }
      
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      
      // Usar el tipo MIME especificado
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Error al crear el Blob'));
          }
        },
        mimeType, // Mantener el formato original
        mimeType === 'image/jpeg' ? 0.9 : undefined // Solo calidad para JPEG
      );
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Error al cargar la imagen'));
    };
    
    img.src = url;
  });
}

// Función para obtener el tipo MIME desde el data URL o Blob
export function getMimeTypeFromDataUrl(dataUrl: string): string {
  const match = dataUrl.match(/^data:(.*?);/);
  return match ? match[1] : 'image/jpeg';
}

export function getMimeTypeFromFile(file: File): string {
  return file.type || 'image/jpeg';
}