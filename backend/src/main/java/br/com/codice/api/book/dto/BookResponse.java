package br.com.codice.api.book.dto;

import java.util.List;
import java.util.UUID;

public record BookResponse(
        UUID id,
        String slug,
        String title,
        String authors,
        String publisher,
        Short publicationYear,
        String edition,
        String language,
        String isbn,
        String translator,
        List<String> academicAreas,
        String synopsis,
        String coverImageUrl,
        int activeListingsCount
) {
}
