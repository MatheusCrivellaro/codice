package br.com.codice.api.admin.dto;

import br.com.codice.api.auth.dto.UserResponse;

public record BootstrapResponse(
        UserResponse user,
        String message
) {
}
