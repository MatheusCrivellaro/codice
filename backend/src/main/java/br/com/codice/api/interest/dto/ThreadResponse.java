package br.com.codice.api.interest.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ThreadResponse(
        UUID id,
        UUID listingId,
        String bookTitle,
        String bookSlug,
        String bookCoverUrl,
        Integer listingPriceCents,
        String listingPriceFormatted,
        String listingCondition,
        String counterpartName,
        String counterpartType,
        String status,
        int unreadCount,
        String lastMessagePreview,
        OffsetDateTime lastMessageAt,
        OffsetDateTime createdAt
) {
}
