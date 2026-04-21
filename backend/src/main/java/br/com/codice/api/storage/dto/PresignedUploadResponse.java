package br.com.codice.api.storage.dto;

public record PresignedUploadResponse(
        String uploadUrl,
        String publicUrl,
        String key
) {
}
