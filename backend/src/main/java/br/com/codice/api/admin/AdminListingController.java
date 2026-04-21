package br.com.codice.api.admin;

import br.com.codice.api.admin.dto.AdminListingResponse;
import br.com.codice.api.admin.dto.PauseRequest;
import br.com.codice.api.listing.Listing;
import br.com.codice.api.listing.ListingRepository;
import br.com.codice.api.listing.ListingStatus;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin/listings")
public class AdminListingController {

    private final ListingRepository listingRepository;

    public AdminListingController(ListingRepository listingRepository) {
        this.listingRepository = listingRepository;
    }

    @GetMapping
    public ResponseEntity<List<AdminListingResponse>> list(
            @RequestParam(required = false) ListingStatus status) {
        List<Listing> listings = status != null
                ? listingRepository.findByStatus(status)
                : listingRepository.findAll();

        var response = listings.stream()
                .map(AdminListingResponse::fromListing)
                .toList();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<AdminListingResponse> approve(@PathVariable UUID id) {
        var listing = listingRepository.findById(id)
                .orElseThrow(() -> new ListingNotFoundException(id));

        listing.setStatus(ListingStatus.ACTIVE);
        listing.setPublishedAt(OffsetDateTime.now());
        listing.setModerationNote(null);
        listing.setUpdatedAt(OffsetDateTime.now());
        listingRepository.save(listing);

        return ResponseEntity.ok(AdminListingResponse.fromListing(listing));
    }

    @PostMapping("/{id}/pause")
    public ResponseEntity<AdminListingResponse> pause(
            @PathVariable UUID id,
            @Valid @RequestBody PauseRequest request) {
        var listing = listingRepository.findById(id)
                .orElseThrow(() -> new ListingNotFoundException(id));

        listing.setStatus(ListingStatus.PAUSED);
        listing.setModerationNote(request.note());
        listing.setUpdatedAt(OffsetDateTime.now());
        listingRepository.save(listing);

        return ResponseEntity.ok(AdminListingResponse.fromListing(listing));
    }

    @PostMapping("/{id}/resume")
    public ResponseEntity<AdminListingResponse> resume(@PathVariable UUID id) {
        var listing = listingRepository.findById(id)
                .orElseThrow(() -> new ListingNotFoundException(id));

        listing.setStatus(ListingStatus.ACTIVE);
        listing.setModerationNote(null);
        listing.setUpdatedAt(OffsetDateTime.now());
        listingRepository.save(listing);

        return ResponseEntity.ok(AdminListingResponse.fromListing(listing));
    }
}
