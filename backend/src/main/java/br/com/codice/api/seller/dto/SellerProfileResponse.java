package br.com.codice.api.seller.dto;

import br.com.codice.api.seller.Seller;

import java.time.OffsetDateTime;
import java.util.UUID;

public record SellerProfileResponse(
        UUID id,
        String publicName,
        String slug,
        String sellerType,
        String description,
        String city,
        String state,
        String neighborhood,
        String bannerImageUrl,
        String avatarImageUrl,
        OffsetDateTime createdAt
) {
    public static SellerProfileResponse fromSeller(Seller seller) {
        return new SellerProfileResponse(
                seller.getId(),
                seller.getPublicName(),
                seller.getSlug(),
                seller.getSellerType().name(),
                seller.getDescription(),
                seller.getCity(),
                seller.getState(),
                seller.getNeighborhood(),
                seller.getBannerImageUrl(),
                seller.getAvatarImageUrl(),
                seller.getCreatedAt()
        );
    }
}
