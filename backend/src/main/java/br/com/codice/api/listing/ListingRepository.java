package br.com.codice.api.listing;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ListingRepository extends JpaRepository<Listing, UUID> {

    List<Listing> findBySellerId(UUID sellerId);

    List<Listing> findByBookId(UUID bookId);

    List<Listing> findByStatus(ListingStatus status);

    List<Listing> findBySellerIdAndStatus(UUID sellerId, ListingStatus status);

    boolean existsByBookIdAndSellerIdAndStatus(UUID bookId, UUID sellerId, ListingStatus status);
}
