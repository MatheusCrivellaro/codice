package br.com.codice.api.book;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BookRepository extends JpaRepository<Book, UUID> {

    Optional<Book> findBySlug(String slug);

    Optional<Book> findByIsbn(String isbn);

    boolean existsBySlug(String slug);

    @Query("""
            SELECT b FROM Book b
            WHERE LOWER(b.title) = LOWER(:title)
              AND LOWER(b.authors) = LOWER(:authors)
            """)
    Optional<Book> findByTitleAndAuthorsIgnoreCase(String title, String authors);

    @Query(value = """
            SELECT b.id, b.slug, b.title, b.authors, b.cover_image_url,
                   COUNT(l.id) AS active_listings_count,
                   MIN(l.price_cents) AS lowest_price_cents
            FROM books b
            JOIN listings l ON l.book_id = b.id AND l.status = 'ACTIVE'
            GROUP BY b.id
            ORDER BY b.created_at DESC
            """,
            countQuery = """
            SELECT COUNT(DISTINCT b.id)
            FROM books b
            JOIN listings l ON l.book_id = b.id AND l.status = 'ACTIVE'
            """,
            nativeQuery = true)
    Page<Object[]> findBooksWithActiveListings(Pageable pageable);

    @Query(value = """
            SELECT COUNT(l.id)
            FROM listings l
            WHERE l.book_id = :bookId AND l.status = 'ACTIVE'
            """, nativeQuery = true)
    int countActiveListingsByBookId(UUID bookId);

    @Query(value = """
            SELECT b.id, b.slug, b.title, b.authors,
                   similarity(b.title::text, :title) AS score
            FROM books b
            WHERE similarity(b.title::text, :title) > 0.3
            ORDER BY score DESC
            LIMIT 5
            """, nativeQuery = true)
    List<Object[]> findByTitleFuzzy(String title);

    @Query(value = """
            SELECT DISTINCT unnest(academic_areas) AS area
            FROM books b
            WHERE EXISTS (SELECT 1 FROM listings l WHERE l.book_id = b.id AND l.status = 'ACTIVE')
            ORDER BY area
            """, nativeQuery = true)
    List<String> findDistinctAcademicAreasWithActiveListings();
}
