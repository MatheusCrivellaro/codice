package br.com.codice.api.book.dto;

import br.com.codice.api.common.PriceFormatter;
import br.com.codice.api.listing.Listing;
import br.com.codice.api.listing.dto.ListingPhotoResponse;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record ListingOfferResponse(
        UUID id,
        UUID sellerId,
        String sellerName,
        String sellerSlug,
        String sellerCity,
        String sellerState,
        int priceCents,
        String priceFormatted,
        String condition,
        String conditionLabel,
        String conditionNotes,
        String description,
        List<ListingPhotoResponse> photos,
        OffsetDateTime publishedAt,
        int interestCount
) {

    private static final Map<String, String> CONDITION_LABELS = Map.of(
            "NOVO", "Novo",
            "COMO_NOVO", "Como novo",
            "MUITO_BOM", "Muito bom",
            "BOM", "Bom",
            "ACEITAVEL", "Aceitavel"
    );

    public static ListingOfferResponse fromListing(Listing listing, int interestCount) {
        var photos = listing.getPhotos().stream()
                .map(ListingPhotoResponse::fromPhoto)
                .toList();
        String condName = listing.getCondition().name();
        return new ListingOfferResponse(
                listing.getId(),
                listing.getSeller().getId(),
                listing.getSeller().getPublicName(),
                listing.getSeller().getSlug(),
                listing.getSeller().getCity(),
                listing.getSeller().getState(),
                listing.getPriceCents(),
                PriceFormatter.format(listing.getPriceCents()),
                condName,
                CONDITION_LABELS.getOrDefault(condName, condName),
                listing.getConditionNotes(),
                listing.getDescription(),
                photos,
                listing.getPublishedAt(),
                interestCount
        );
    }
}
