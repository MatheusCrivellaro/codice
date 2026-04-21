package br.com.codice.api.interest;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface InterestThreadRepository extends JpaRepository<InterestThread, UUID> {

    Optional<InterestThread> findByListingIdAndBuyerId(UUID listingId, UUID buyerId);

    Page<InterestThread> findByBuyerIdOrderByLastMessageAtDesc(UUID buyerId, Pageable pageable);

    @Query("""
            SELECT t FROM InterestThread t
            JOIN t.listing l
            JOIN l.seller s
            WHERE s.user.id = :userId
            ORDER BY t.lastMessageAt DESC NULLS LAST
            """)
    Page<InterestThread> findBySellerUserId(UUID userId, Pageable pageable);

    @Query("""
            SELECT t FROM InterestThread t
            WHERE t.buyer.id = :userId
               OR t.listing.seller.user.id = :userId
            ORDER BY t.lastMessageAt DESC NULLS LAST
            """)
    Page<InterestThread> findByParticipantUserId(UUID userId, Pageable pageable);

    @Query(value = """
            SELECT COUNT(DISTINCT it.id)
            FROM interest_threads it
            LEFT JOIN thread_read_status trs
                ON trs.thread_id = it.id AND trs.user_id = :userId
            WHERE (it.buyer_id = :userId OR it.listing_id IN (
                SELECT l.id FROM listings l JOIN sellers s ON s.id = l.seller_id WHERE s.user_id = :userId
            ))
            AND EXISTS (
                SELECT 1 FROM messages m
                WHERE m.thread_id = it.id
                  AND m.created_at > COALESCE(trs.last_read_at, '1970-01-01'::timestamptz)
                  AND m.sender_id != :userId
            )
            """, nativeQuery = true)
    int countThreadsWithUnreadMessages(UUID userId);

    int countByListingIdAndStatus(UUID listingId, ThreadStatus status);
}
