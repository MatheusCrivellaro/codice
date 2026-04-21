import { apiFetch } from '@/api/client'

export interface PresignedUploadResponse {
    uploadUrl: string
    publicUrl: string
    key: string
}

export function getPresignedUrl(filename: string, contentType: string): Promise<PresignedUploadResponse> {
    return apiFetch<PresignedUploadResponse>('/uploads/presign', {
        method: 'POST',
        body: JSON.stringify({ filename, contentType }),
    })
}

export async function uploadFileToR2(file: File, presignedUrl: string): Promise<void> {
    const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': file.type,
        },
    })
    if (!response.ok) {
        throw new Error(`Upload falhou com status ${response.status}`)
    }
}

export async function uploadPhoto(file: File): Promise<PresignedUploadResponse> {
    const presigned = await getPresignedUrl(file.name, file.type)
    await uploadFileToR2(file, presigned.uploadUrl)
    return presigned
}
