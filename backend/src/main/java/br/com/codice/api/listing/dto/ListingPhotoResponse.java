package br.com.codice.api.listing.dto;

import br.com.codice.api.listing.ListingPhoto;

import java.util.UUID;

public record ListingPhotoResponse(
        UUID id,
        String url,
        int position,
        String photoType
) {
    public static ListingPhotoResponse fromPhoto(ListingPhoto photo) {
        return new ListingPhotoResponse(
                photo.getId(),
                photo.getUrl(),
                photo.getPosition(),
                photo.getPhotoType().name()
        );
    }
}
