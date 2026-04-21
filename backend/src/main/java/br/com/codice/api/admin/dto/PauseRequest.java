package br.com.codice.api.admin.dto;

import jakarta.validation.constraints.NotBlank;

public record PauseRequest(
        @NotBlank String note
) {
}
