package br.com.codice.api.listing.dto;

import br.com.codice.api.common.PriceFormatter;
import br.com.codice.api.listing.Listing;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record ListingResponse(
        UUID id,
        UUID bookId,
        String bookTitle,
        String bookAuthors,
        String bookSlug,
        UUID sellerId,
        String sellerName,
        int priceCents,
        String priceFormatted,
        String condition,
        String conditionNotes,
        String description,
        String status,
        List<ListingPhotoResponse> photos,
        OffsetDateTime createdAt
) {
    public static ListingResponse fromListing(Listing listing) {
        var photos = listing.getPhotos().stream()
                .map(ListingPhotoResponse::fromPhoto)
                .toList();

        return new ListingResponse(
                listing.getId(),
                listing.getBook().getId(),
                listing.getBook().getTitle(),
                listing.getBook().getAuthors(),
                listing.getBook().getSlug(),
                listing.getSeller().getId(),
                listing.getSeller().getPublicName(),
                listing.getPriceCents(),
                PriceFormatter.format(listing.getPriceCents()),
                listing.getCondition().name(),
                listing.getConditionNotes(),
                listing.getDescription(),
                listing.getStatus().name(),
                photos,
                listing.getCreatedAt()
        );
    }
}
