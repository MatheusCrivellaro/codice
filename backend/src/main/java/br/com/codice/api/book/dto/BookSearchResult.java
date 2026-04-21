package br.com.codice.api.book.dto;

import java.util.List;
import java.util.UUID;

public record BookSearchResult(
        UUID id,
        String slug,
        String title,
        String authors,
        String coverImageUrl,
        List<String> academicAreas,
        int activeListingsCount,
        Integer lowestPriceCents,
        Double relevanceScore
) {
}
