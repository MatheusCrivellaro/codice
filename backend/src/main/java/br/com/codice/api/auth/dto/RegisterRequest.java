package br.com.codice.api.auth.dto;

import br.com.codice.api.user.ProfileType;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Email é obrigatório")
        @Email(message = "Email deve ser válido")
        String email,

        @NotBlank(message = "Senha é obrigatória")
        @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres")
        String password,

        @NotBlank(message = "Nome é obrigatório")
        String name,

        @NotNull(message = "Tipo de perfil é obrigatório")
        ProfileType profileType,

        @AssertTrue(message = "Aceite da política de privacidade é obrigatório")
        boolean acceptedPrivacyPolicy
) {
}
