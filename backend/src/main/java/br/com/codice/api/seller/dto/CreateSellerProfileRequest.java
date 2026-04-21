package br.com.codice.api.seller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateSellerProfileRequest(
        @NotBlank @Size(max = 150) String publicName,
        @NotBlank @Size(min = 20, max = 2000) String description,
        @NotBlank @Size(max = 120) String city,
        @NotBlank @Size(min = 2, max = 2) String state,
        @Size(max = 120) String neighborhood
) {
}
