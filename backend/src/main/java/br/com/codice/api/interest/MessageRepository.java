package br.com.codice.api.interest;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {

    Page<Message> findByThreadIdOrderByCreatedAtAsc(UUID threadId, Pageable pageable);

    @Query("""
            SELECT m FROM Message m
            WHERE m.thread.id = :threadId
            ORDER BY m.createdAt DESC
            LIMIT 1
            """)
    Optional<Message> findLastByThreadId(UUID threadId);

    @Query(value = """
            SELECT COUNT(m.id) FROM messages m
            WHERE m.thread_id = :threadId
              AND m.created_at > :since
              AND m.sender_id != :userId
            """, nativeQuery = true)
    int countUnreadForUser(UUID threadId, OffsetDateTime since, UUID userId);
}
