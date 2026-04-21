package br.com.codice.api.book;

import br.com.codice.api.book.dto.BookDetailResponse;
import br.com.codice.api.book.dto.BookFuzzyMatch;
import br.com.codice.api.book.dto.BookListItem;
import br.com.codice.api.book.dto.BookResponse;
import br.com.codice.api.book.dto.ListingOfferResponse;
import br.com.codice.api.interest.InterestThreadRepository;
import br.com.codice.api.interest.ThreadStatus;
import br.com.codice.api.listing.ListingRepository;
import br.com.codice.api.listing.ListingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final ListingRepository listingRepository;
    private final InterestThreadRepository interestThreadRepository;

    public BookService(BookRepository bookRepository,
                       ListingRepository listingRepository,
                       InterestThreadRepository interestThreadRepository) {
        this.bookRepository = bookRepository;
        this.listingRepository = listingRepository;
        this.interestThreadRepository = interestThreadRepository;
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

    @Transactional(readOnly = true)
    public BookDetailResponse findDetailBySlug(String slug) {
        Book book = bookRepository.findBySlug(slug)
                .orElseThrow(() -> new BookNotFoundException(slug));
        var activeListings = listingRepository.findByBookIdAndStatusOrderByPriceCentsAsc(
                book.getId(), ListingStatus.ACTIVE);
        var offers = activeListings.stream()
                .map(listing -> {
                    int interestCount = interestThreadRepository.countByListingIdAndStatus(
                            listing.getId(), ThreadStatus.OPEN);
                    return ListingOfferResponse.fromListing(listing, interestCount);
                })
                .toList();
        return BookDetailResponse.from(book, offers);
    }

    @Transactional(readOnly = true)
    public List<String> getAcademicAreas() {
        return bookRepository.findDistinctAcademicAreasWithActiveListings();
    }

    @Transactional(readOnly = true)
    public List<BookFuzzyMatch> fuzzySearch(String title) {
        return bookRepository.findByTitleFuzzy(title).stream()
                .map(row -> new BookFuzzyMatch(
                        (UUID) row[0],
                        (String) row[1],
                        (String) row[2],
                        (String) row[3],
                        ((Number) row[4]).doubleValue()
                ))
                .toList();
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
