package br.com.codice.api.book.dto;

import br.com.codice.api.book.Book;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

public record BookDetailResponse(
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
        int activeListingsCount,
        List<ListingOfferResponse> listings
) {
    public static BookDetailResponse from(Book book, List<ListingOfferResponse> offers) {
        return new BookDetailResponse(
                book.getId(),
                book.getSlug(),
                book.getTitle(),
                book.getAuthors(),
                book.getPublisher(),
                book.getPublicationYear(),
                book.getEdition(),
                book.getLanguage(),
                book.getIsbn(),
                book.getTranslator(),
                book.getAcademicAreas() != null ? Arrays.asList(book.getAcademicAreas()) : List.of(),
                book.getSynopsis(),
                book.getCoverImageUrl(),
                offers.size(),
                offers
        );
    }
}
