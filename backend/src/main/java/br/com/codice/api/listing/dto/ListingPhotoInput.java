package br.com.codice.api.listing.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ListingPhotoInput(
        @NotBlank @Size(max = 500) String url,
        @NotNull @Min(0) Integer position,
        @NotBlank String photoType
) {
}
