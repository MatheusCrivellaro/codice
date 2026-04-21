package br.com.codice.api.book.dto;

import java.util.UUID;

public record BookFuzzyMatch(
        UUID id,
        String slug,
        String title,
        String authors,
        double score
) {
}
