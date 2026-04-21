package br.com.codice.api.admin;

import br.com.codice.api.book.Book;
import br.com.codice.api.book.BookRepository;
import br.com.codice.api.common.SlugService;
import br.com.codice.api.listing.BookCondition;
import br.com.codice.api.listing.Listing;
import br.com.codice.api.listing.ListingPhoto;
import br.com.codice.api.listing.ListingRepository;
import br.com.codice.api.listing.ListingStatus;
import br.com.codice.api.listing.PhotoType;
import br.com.codice.api.seller.Seller;
import br.com.codice.api.seller.SellerRepository;
import br.com.codice.api.seller.SellerType;
import br.com.codice.api.user.ProfileType;
import br.com.codice.api.user.User;
import br.com.codice.api.user.UserRepository;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.InputStream;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class SeedService {

    private static final String SEED_DIR = "seed/";

    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;
    private final BookRepository bookRepository;
    private final ListingRepository listingRepository;
    private final SlugService slugService;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    public SeedService(UserRepository userRepository,
                       SellerRepository sellerRepository,
                       BookRepository bookRepository,
                       ListingRepository listingRepository,
                       SlugService slugService,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.sellerRepository = sellerRepository;
        this.bookRepository = bookRepository;
        this.listingRepository = listingRepository;
        this.slugService = slugService;
        this.passwordEncoder = passwordEncoder;
        this.objectMapper = new ObjectMapper()
                .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
    }

    @Transactional
    public Map<String, Object> seed() {
        List<SellerSeed> sellerSeeds = readJson("sellers.json", SellerSeed[].class);
        List<BookSeed> bookSeeds = readJson("books.json", BookSeed[].class);
        List<ListingSeed> listingSeeds = readJson("listings.json", ListingSeed[].class);

        Map<String, Seller> sellersByEmail = new LinkedHashMap<>();
        Map<String, Book> booksByIsbn = new LinkedHashMap<>();
        Map<String, Book> booksByKey = new LinkedHashMap<>();

        int usersCreated = 0;
        int sellersCreated = 0;
        int sellersSkipped = 0;
        int booksCreated = 0;
        int booksSkipped = 0;
        int listingsCreated = 0;
        int listingsSkipped = 0;

        for (SellerSeed seed : sellerSeeds) {
            User existingUser = userRepository.findByEmail(seed.email).orElse(null);
            User user = existingUser;
            if (user == null) {
                user = new User(
                        seed.email,
                        passwordEncoder.encode(seed.password),
                        seed.userName,
                        ProfileType.valueOf(seed.profileType),
                        OffsetDateTime.now()
                );
                user = userRepository.save(user);
                usersCreated++;
            }

            Seller seller = sellerRepository.findByUserId(user.getId()).orElse(null);
            if (seller == null) {
                String slug = slugService.generateSellerSlug(seed.publicName);
                seller = new Seller(
                        user,
                        SellerType.valueOf(seed.sellerType),
                        seed.publicName,
                        slug,
                        seed.description,
                        seed.city,
                        seed.state
                );
                if (seed.neighborhood != null) {
                    seller.setNeighborhood(seed.neighborhood);
                }
                seller = sellerRepository.save(seller);
                sellersCreated++;
            } else {
                sellersSkipped++;
            }
            sellersByEmail.put(seed.email, seller);
        }

        for (BookSeed seed : bookSeeds) {
            Book existing = null;
            if (seed.isbn != null && !seed.isbn.isBlank()) {
                existing = bookRepository.findByIsbn(seed.isbn).orElse(null);
            }
            if (existing == null) {
                existing = bookRepository
                        .findByTitleAndAuthorsIgnoreCase(seed.title, seed.authors)
                        .orElse(null);
            }

            Book book;
            if (existing != null) {
                book = existing;
                booksSkipped++;
            } else {
                String slug = slugService.generateBookSlug(seed.title);
                Short year = seed.publicationYear != null ? seed.publicationYear.shortValue() : null;
                String[] areas = seed.academicAreas != null
                        ? seed.academicAreas.toArray(new String[0])
                        : new String[]{};
                String language = seed.language != null ? seed.language : "pt-BR";
                book = new Book(
                        slug,
                        seed.title,
                        seed.authors,
                        seed.publisher,
                        year,
                        seed.edition,
                        language,
                        seed.isbn,
                        seed.translator,
                        areas,
                        seed.synopsis,
                        null
                );
                book = bookRepository.save(book);
                booksCreated++;
            }

            if (book.getIsbn() != null) {
                booksByIsbn.put(book.getIsbn(), book);
            }
            booksByKey.put(bookKey(seed.title, seed.authors), book);
        }

        for (ListingSeed seed : listingSeeds) {
            Seller seller = sellersByEmail.get(seed.sellerEmail);
            if (seller == null) {
                continue;
            }

            Book book = null;
            if (seed.bookIsbn != null && !seed.bookIsbn.isBlank()) {
                book = booksByIsbn.get(seed.bookIsbn);
            }
            if (book == null && seed.bookTitle != null) {
                String authors = seed.bookAuthors != null ? seed.bookAuthors : "";
                book = booksByKey.get(bookKey(seed.bookTitle, authors));
                if (book == null) {
                    book = bookRepository
                            .findByTitleAndAuthorsIgnoreCase(seed.bookTitle, authors)
                            .orElse(null);
                }
            }
            if (book == null) {
                continue;
            }

            ListingStatus status = ListingStatus.valueOf(seed.status);
            if (listingRepository.existsByBookIdAndSellerIdAndStatus(book.getId(), seller.getId(), status)) {
                listingsSkipped++;
                continue;
            }

            int priceCents = seed.priceCents;
            BookCondition condition = BookCondition.valueOf(seed.condition);
            Listing listing = new Listing(
                    seller, book, priceCents, condition,
                    seed.conditionNotes, seed.description, status
            );
            attachPhotos(listing, seed, book, seller);
            listingRepository.save(listing);
            listingsCreated++;
        }

        List<Map<String, String>> credentials = new ArrayList<>();
        for (SellerSeed seed : sellerSeeds) {
            credentials.add(Map.of(
                    "email", seed.email,
                    "password", seed.password,
                    "role", seed.sellerType
            ));
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("usersCreated", usersCreated);
        result.put("sellersCreated", sellersCreated);
        result.put("sellersSkipped", sellersSkipped);
        result.put("booksCreated", booksCreated);
        result.put("booksSkipped", booksSkipped);
        result.put("listingsCreated", listingsCreated);
        result.put("listingsSkipped", listingsSkipped);
        result.put("testCredentials", credentials);
        return result;
    }

    private void attachPhotos(Listing listing, ListingSeed seed, Book book, Seller seller) {
        if (seed.photos != null && !seed.photos.isEmpty()) {
            for (PhotoSeed p : seed.photos) {
                short pos = p.position != null ? p.position.shortValue() : (short) listing.getPhotos().size();
                PhotoType type = p.photoType != null ? PhotoType.valueOf(p.photoType) : PhotoType.OTHER;
                listing.addPhoto(new ListingPhoto(listing, p.url, pos, type));
            }
            return;
        }
        String base = "https://picsum.photos/seed/" + book.getSlug() + "-" + seller.getSlug();
        listing.addPhoto(new ListingPhoto(listing, base + "-1/400/600", (short) 0, PhotoType.COVER_FRONT));
        listing.addPhoto(new ListingPhoto(listing, base + "-2/400/600", (short) 1, PhotoType.SPINE_BACK));
        listing.addPhoto(new ListingPhoto(listing, base + "-3/400/600", (short) 2, PhotoType.INNER_DETAIL));
    }

    private String bookKey(String title, String authors) {
        String t = title != null ? title.toLowerCase().trim() : "";
        String a = authors != null ? authors.toLowerCase().trim() : "";
        return t + "|" + a;
    }

    private <T> List<T> readJson(String filename, Class<T[]> arrayType) {
        ClassPathResource resource = new ClassPathResource(SEED_DIR + filename);
        try (InputStream in = resource.getInputStream()) {
            T[] parsed = objectMapper.readValue(in, arrayType);
            return new ArrayList<>(List.of(parsed));
        } catch (IOException e) {
            throw new IllegalStateException("Falha ao carregar " + filename, e);
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    static class SellerSeed {
        public String email;
        public String password;
        public String userName;
        public String profileType;
        public String sellerType;
        public String publicName;
        public String description;
        public String city;
        public String state;
        public String neighborhood;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    static class BookSeed {
        public String title;
        public String authors;
        public String publisher;
        public Integer publicationYear;
        public String edition;
        public String language;
        public String isbn;
        public String translator;
        public List<String> academicAreas;
        public String synopsis;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    static class ListingSeed {
        public String bookIsbn;
        public String bookTitle;
        public String bookAuthors;
        public String sellerEmail;
        public int priceCents;
        public String condition;
        public String conditionNotes;
        public String description;
        public String status;
        public List<PhotoSeed> photos;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    static class PhotoSeed {
        public String url;
        public Integer position;
        public String photoType;
    }
}
