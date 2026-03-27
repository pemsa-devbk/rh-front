import { AxiosResponseHeaders, RawAxiosResponseHeaders } from "axios";

export const downloadFile = ({
    blob,
    headers,
    customFileName
}: {
    blob: Blob,
    headers: RawAxiosResponseHeaders | AxiosResponseHeaders
    customFileName?: string; // Nombre sin extensión
}) => {

    let fileName: string;

    if (customFileName) {
        // Si se proporciona nombre personalizado, agregar extensión
        const contentType = headers['content-type'] || blob.type;
        const extension = getExtensionFromMimeType(contentType);
        fileName = `${customFileName}${extension}`;
    } else {
        // Si no hay nombre personalizado, usar el del servidor
        const contentDisposition = headers['Content-Disposition'] || headers['content-disposition'];
        console.log(headers);
        
        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (fileNameMatch && fileNameMatch[1]) {
                fileName = fileNameMatch[1].replace(/['"]/g, '');
            } else {
                // Fallback si no se encuentra el nombre
                fileName = `archivo${getExtensionFromMimeType(blob.type)}`;
            }
        } else {
            // Fallback si no hay content-disposition
            fileName = `archivo${getExtensionFromMimeType(blob.type)}`;
        }
    }

    // Crear y descargar el archivo
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();

    // Cleanup
    link.remove();
    window.URL.revokeObjectURL(url);


}

// ============= Helper: Obtener extensión desde MIME type =============
const getExtensionFromMimeType = (mimeType: string): string => {
    const mimeMap: Record<string, string> = {
        'application/pdf': '.pdf',
        'image/jpeg': '.jpg',
        'image/jpg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
        'image/webp': '.webp',
        'application/msword': '.doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
        'application/vnd.ms-excel': '.xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
        'text/plain': '.txt',
        'application/zip': '.zip',
        'application/x-rar-compressed': '.rar',
    };

    return mimeMap[mimeType] || '.bin';
}