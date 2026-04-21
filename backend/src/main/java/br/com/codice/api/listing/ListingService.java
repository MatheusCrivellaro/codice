package br.com.codice.api.listing;

import br.com.codice.api.book.Book;
import br.com.codice.api.book.BookRepository;
import br.com.codice.api.common.SlugService;
import br.com.codice.api.listing.dto.CreateListingRequest;
import br.com.codice.api.listing.dto.ListingPhotoInput;
import br.com.codice.api.listing.dto.ListingResponse;
import br.com.codice.api.listing.dto.ManualBookData;
import br.com.codice.api.lookup.BookLookupService;
import br.com.codice.api.lookup.IsbnValidator;
import br.com.codice.api.lookup.dto.BookLookupResponse;
import br.com.codice.api.seller.BuyerCannotSellException;
import br.com.codice.api.seller.Seller;
import br.com.codice.api.seller.SellerRepository;
import br.com.codice.api.seller.SellerType;
import br.com.codice.api.user.ProfileType;
import br.com.codice.api.user.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ListingService {

    private static final Logger log = LoggerFactory.getLogger(ListingService.class);

    private final ListingRepository listingRepository;
    private final BookRepository bookRepository;
    private final SellerRepository sellerRepository;
    private final BookLookupService bookLookupService;
    private final SlugService slugService;

    public ListingService(ListingRepository listingRepository,
                          BookRepository bookRepository,
                          SellerRepository sellerRepository,
                          BookLookupService bookLookupService,
                          SlugService slugService) {
        this.listingRepository = listingRepository;
        this.bookRepository = bookRepository;
        this.sellerRepository = sellerRepository;
        this.bookLookupService = bookLookupService;
        this.slugService = slugService;
    }

    @Transactional
    public ListingResponse createListing(User user, CreateListingRequest request) {
        Seller seller = resolveSeller(user);
        Book book = resolveBook(request);
        BookCondition condition = parseCondition(request.condition());

        var listing = new Listing(
                seller,
                book,
                request.priceCents(),
                condition,
                request.conditionNotes(),
                request.description(),
                ListingStatus.PENDING_REVIEW
        );

        for (ListingPhotoInput photoInput : request.photos()) {
            PhotoType photoType = parsePhotoType(photoInput.photoType());
            var photo = new ListingPhoto(
                    listing,
                    photoInput.url(),
                    photoInput.position().shortValue(),
                    photoType
            );
            listing.addPhoto(photo);
        }

        listing = listingRepository.save(listing);
        return ListingResponse.fromListing(listing);
    }

    @Transactional(readOnly = true)
    public Page<ListingResponse> getMyListings(User user, Pageable pageable) {
        Optional<Seller> seller = sellerRepository.findByUserId(user.getId());
        if (seller.isEmpty()) {
            return Page.empty(pageable);
        }
        return listingRepository.findBySellerIdOrderByCreatedAtDesc(seller.get().getId(), pageable)
                .map(ListingResponse::fromListing);
    }

    private Seller resolveSeller(User user) {
        if (user.getProfileType() == ProfileType.BUYER) {
            throw new BuyerCannotSellException();
        }

        Optional<Seller> existing = sellerRepository.findByUserId(user.getId());

        if (existing.isPresent()) {
            return existing.get();
        }

        if (user.getProfileType() == ProfileType.BOOKSTORE) {
            throw new BookstoreNeedsProfileException();
        }

        return autoProvisionSeller(user);
    }

    private Seller autoProvisionSeller(User user) {
        String slug = slugService.generateSellerSlug(user.getName());
        var seller = new Seller(
                user,
                SellerType.INDIVIDUAL,
                user.getName(),
                slug,
                null,
                null,
                null
        );
        return sellerRepository.save(seller);
    }

    private Book resolveBook(CreateListingRequest request) {
        String isbn = request.isbn();
        boolean hasIsbn = isbn != null && !isbn.isBlank();
        ManualBookData manual = request.manualBookData();

        if (!hasIsbn && manual == null) {
            throw new InvalidListingRequestException("Informe o ISBN ou os dados do livro manualmente.");
        }

        if (hasIsbn) {
            return resolveBookByIsbn(isbn, manual);
        }

        return resolveBookManually(manual);
    }

    private Book resolveBookByIsbn(String rawIsbn, ManualBookData manual) {
        String isbn = IsbnValidator.normalize(rawIsbn);

        Optional<Book> existing = bookRepository.findByIsbn(isbn);
        if (existing.isPresent()) {
            return existing.get();
        }

        Optional<BookLookupResponse> lookup;
        try {
            lookup = bookLookupService.lookup(isbn);
        } catch (Exception e) {
            log.warn("Erro no lookup de ISBN {}: {}", isbn, e.getMessage());
            lookup = Optional.empty();
        }

        if (lookup.isPresent()) {
            return createBookFromLookup(lookup.get());
        }

        if (manual != null) {
            return createBookFromManualData(manual, isbn);
        }

        throw new InvalidListingRequestException(
                "ISBN nao encontrado. Preencha os dados manualmente.");
    }

    private Book resolveBookManually(ManualBookData manual) {
        List<Object[]> matches = bookRepository.findByTitleFuzzy(manual.title());

        for (Object[] row : matches) {
            double score = ((Number) row[4]).doubleValue();
            if (score > 0.8) {
                log.info("Fuzzy match forte (score={}) para '{}', reusando book existente", score, manual.title());
                return bookRepository.findById((java.util.UUID) row[0]).orElseThrow();
            }
            if (score > 0.6) {
                log.warn("Fuzzy match fraco (score={}) para '{}', criando novo book (possivel duplicata)", score, manual.title());
                break;
            }
        }

        return createBookFromManualData(manual, null);
    }

    private Book createBookFromLookup(BookLookupResponse lookup) {
        String slug = slugService.generateBookSlug(lookup.title());

        var book = new Book(
                slug,
                lookup.title(),
                lookup.authors(),
                lookup.publisher(),
                lookup.publicationYear() != null ? lookup.publicationYear().shortValue() : null,
                lookup.edition(),
                lookup.language() != null ? lookup.language() : "pt-BR",
                lookup.isbn(),
                null,
                null,
                lookup.synopsis(),
                lookup.coverImageUrl()
        );
        return bookRepository.save(book);
    }

    private Book createBookFromManualData(ManualBookData manual, String isbn) {
        String slug = slugService.generateBookSlug(manual.title());
        String language = manual.language() != null ? manual.language() : "pt-BR";
        String[] areas = manual.academicAreas() != null
                ? manual.academicAreas().toArray(new String[0])
                : null;

        var book = new Book(
                slug,
                manual.title(),
                manual.authors(),
                manual.publisher(),
                manual.publicationYear() != null ? manual.publicationYear().shortValue() : null,
                manual.edition(),
                language,
                isbn,
                manual.translator(),
                areas,
                manual.synopsis(),
                null
        );
        return bookRepository.save(book);
    }

    private BookCondition parseCondition(String condition) {
        try {
            return BookCondition.valueOf(condition);
        } catch (IllegalArgumentException e) {
            throw new InvalidListingRequestException(
                    "Condicao invalida: " + condition + ". Valores aceitos: NOVO, COMO_NOVO, MUITO_BOM, BOM, ACEITAVEL.");
        }
    }

    private PhotoType parsePhotoType(String photoType) {
        try {
            return PhotoType.valueOf(photoType);
        } catch (IllegalArgumentException e) {
            throw new InvalidListingRequestException(
                    "Tipo de foto invalido: " + photoType + ". Valores aceitos: COVER_FRONT, SPINE_BACK, INNER_DETAIL, DEFECT, TITLE_PAGE, OTHER.");
        }
    }
}
