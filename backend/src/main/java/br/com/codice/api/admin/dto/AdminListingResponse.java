package br.com.codice.api.admin.dto;

import br.com.codice.api.listing.BookCondition;
import br.com.codice.api.listing.Listing;
import br.com.codice.api.listing.ListingStatus;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record AdminListingResponse(
        UUID id,
        String bookTitle,
        String bookAuthors,
        String bookCoverImageUrl,
        String sellerName,
        int priceCents,
        BookCondition condition,
        String conditionNotes,
        String description,
        ListingStatus status,
        String moderationNote,
        OffsetDateTime publishedAt,
        OffsetDateTime createdAt,
        List<String> photoUrls
) {
    public static AdminListingResponse fromListing(Listing listing) {
        return new AdminListingResponse(
                listing.getId(),
                listing.getBook().getTitle(),
                listing.getBook().getAuthors(),
                listing.getBook().getCoverImageUrl(),
                listing.getSeller().getPublicName(),
                listing.getPriceCents(),
                listing.getCondition(),
                listing.getConditionNotes(),
                listing.getDescription(),
                listing.getStatus(),
                listing.getModerationNote(),
                listing.getPublishedAt(),
                listing.getCreatedAt(),
                listing.getPhotos().stream().map(p -> p.getUrl()).toList()
        );
    }
}
