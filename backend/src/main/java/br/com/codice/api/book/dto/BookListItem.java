package br.com.codice.api.book.dto;

import java.util.UUID;

public record BookListItem(
        UUID id,
        String slug,
        String title,
        String authors,
        String coverImageUrl,
        int activeListingsCount,
        Integer lowestPriceCents
) {
}
