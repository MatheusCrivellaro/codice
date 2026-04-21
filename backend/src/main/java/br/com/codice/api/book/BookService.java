package br.com.codice.api.book;

import br.com.codice.api.book.dto.BookListItem;
import br.com.codice.api.book.dto.BookResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.UUID;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Transactional(readOnly = true)
    public Page<BookListItem> listBooksWithActiveListings(Pageable pageable) {
        Pageable unsorted = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize());
        return bookRepository.findBooksWithActiveListings(unsorted)
                .map(row -> new BookListItem(
                        (UUID) row[0],
                        (String) row[1],
                        (String) row[2],
                        (String) row[3],
                        (String) row[4],
                        ((Number) row[5]).intValue(),
                        row[6] != null ? ((Number) row[6]).intValue() : null
                ));
    }

    @Transactional(readOnly = true)
    public BookResponse findBySlug(String slug) {
        Book book = bookRepository.findBySlug(slug)
                .orElseThrow(() -> new BookNotFoundException(slug));
        int activeCount = bookRepository.countActiveListingsByBookId(book.getId());
        return toResponse(book, activeCount);
    }

    private BookResponse toResponse(Book book, int activeListingsCount) {
        return new BookResponse(
                book.getId(),
                book.getSlug(),
                book.getTitle(),
                book.getAuthors(),
                book.getPublisher(),
                book.getPublicationYear(),
                book.getEdition(),
                book.getLanguage(),
                book.getIsbn(),
                book.getTranslator(),
                book.getAcademicAreas() != null ? Arrays.asList(book.getAcademicAreas()) : java.util.List.of(),
                book.getSynopsis(),
                book.getCoverImageUrl(),
                activeListingsCount
        );
    }
}
