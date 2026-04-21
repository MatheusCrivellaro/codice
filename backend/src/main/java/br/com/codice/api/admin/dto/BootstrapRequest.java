package br.com.codice.api.admin.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record BootstrapRequest(
        @NotBlank @Email String email
) {
}
