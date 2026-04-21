package br.com.codice.api.listing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ManualBookData(
        @NotBlank @Size(max = 300) String title,
        @NotBlank @Size(max = 500) String authors,
        @Size(max = 200) String publisher,
        Integer publicationYear,
        @Size(max = 50) String edition,
        String language,
        @Size(max = 200) String translator,
        List<String> academicAreas,
        @Size(max = 5000) String synopsis
) {
}
