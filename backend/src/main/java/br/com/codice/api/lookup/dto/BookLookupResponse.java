package br.com.codice.api.lookup.dto;

public record BookLookupResponse(
        String title,
        String authors,
        String publisher,
        Integer publicationYear,
        String edition,
        String language,
        String isbn,
        String synopsis,
        String coverImageUrl,
        String source,
        Integer rawPageCount
) {
}
