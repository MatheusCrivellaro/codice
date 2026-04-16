package br.com.codice.api.auth.dto;

import br.com.codice.api.user.ProfileType;
import br.com.codice.api.user.User;

import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        String name,
        ProfileType profileType
) {
    public static UserResponse fromUser(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getProfileType()
        );
    }
}
