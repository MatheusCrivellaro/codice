package br.com.codice.api.interest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateInterestRequest(
        @NotNull UUID listingId,
        @NotBlank @Size(max = 2000) String message
) {
}
