package br.com.codice.api.seller;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SellerRepository extends JpaRepository<Seller, UUID> {

    Optional<Seller> findByUserId(UUID userId);

    Optional<Seller> findBySlug(String slug);

    boolean existsBySlug(String slug);

    @Query(value = """
            SELECT DISTINCT s.state
            FROM sellers s
            WHERE s.state IS NOT NULL
              AND EXISTS (SELECT 1 FROM listings l WHERE l.seller_id = s.id AND l.status = 'ACTIVE')
            ORDER BY s.state
            """, nativeQuery = true)
    List<String> findDistinctStatesWithActiveListings();
}
