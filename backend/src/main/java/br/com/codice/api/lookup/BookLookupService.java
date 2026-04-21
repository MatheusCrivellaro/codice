package br.com.codice.api.lookup;

import br.com.codice.api.lookup.client.GoogleBooksClient;
import br.com.codice.api.lookup.client.OpenLibraryClient;
import br.com.codice.api.lookup.dto.BookLookupResponse;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;

@Service
public class BookLookupService {

    private static final Logger log = LoggerFactory.getLogger(BookLookupService.class);
    private static final String MISS_SENTINEL = "__MISS__";

    private final GoogleBooksClient googleBooksClient;
    private final OpenLibraryClient openLibraryClient;
    private final Cache<String, BookLookupResponse> hitCache;
    private final Cache<String, String> missCache;

    public BookLookupService(
            GoogleBooksClient googleBooksClient,
            OpenLibraryClient openLibraryClient,
            @Value("${codice.lookup.cache-ttl-hours:24}") int cacheTtlHours) {
        this.googleBooksClient = googleBooksClient;
        this.openLibraryClient = openLibraryClient;

        this.hitCache = Caffeine.newBuilder()
                .maximumSize(5000)
                .expireAfterWrite(Duration.ofHours(cacheTtlHours))
                .build();

        this.missCache = Caffeine.newBuilder()
                .maximumSize(5000)
                .expireAfterWrite(Duration.ofHours(1))
                .build();
    }

    public Optional<BookLookupResponse> lookup(String rawIsbn) {
        String isbn = IsbnValidator.normalize(rawIsbn);

        if (!IsbnValidator.isValid(isbn)) {
            throw new InvalidIsbnException(rawIsbn);
        }

        BookLookupResponse cached = hitCache.getIfPresent(isbn);
        if (cached != null) {
            log.debug("Cache hit para ISBN {}", isbn);
            return Optional.of(cached);
        }

        if (missCache.getIfPresent(isbn) != null) {
            log.debug("Cache miss (negativo) para ISBN {}", isbn);
            return Optional.empty();
        }

        Optional<BookLookupResponse> result = googleBooksClient.lookup(isbn);

        if (result.isEmpty()) {
            log.debug("Google Books nao encontrou ISBN {}, tentando Open Library", isbn);
            result = openLibraryClient.lookup(isbn);
        }

        if (result.isPresent()) {
            hitCache.put(isbn, result.get());
        } else {
            missCache.put(isbn, MISS_SENTINEL);
        }

        return result;
    }
}
