package br.com.codice.api.storage.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PresignedUploadRequest(
        @NotBlank @Size(max = 255) String filename,
        @NotBlank @Size(max = 100) String contentType
) {
}
