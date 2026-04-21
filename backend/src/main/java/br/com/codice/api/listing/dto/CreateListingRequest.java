package br.com.codice.api.listing.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateListingRequest(
        String isbn,
        @Valid ManualBookData manualBookData,
        @NotNull @Min(100) Integer priceCents,
        @NotBlank String condition,
        @Size(max = 1000) String conditionNotes,
        @Size(max = 2000) String description,
        @NotNull @Size(min = 1, max = 10) List<@Valid ListingPhotoInput> photos
) {
}
