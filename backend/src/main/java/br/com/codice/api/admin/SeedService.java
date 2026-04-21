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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class SeedService {

    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;
    private final BookRepository bookRepository;
    private final ListingRepository listingRepository;
    private final SlugService slugService;
    private final PasswordEncoder passwordEncoder;

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
    }

    @Transactional
    public Map<String, Object> seed() {
        int usersCreated = 0;
        int sellersCreated = 0;
        int booksCreated = 0;
        int listingsCreated = 0;

        // --- Users de teste ---
        String passwordHash = passwordEncoder.encode("senha123");

        User seboUser = userRepository.findByEmail("sebo@codice.dev").orElse(null);
        if (seboUser == null) {
            seboUser = new User("sebo@codice.dev", passwordHash, "Sebo Letras Vivas",
                    ProfileType.BOOKSTORE, OffsetDateTime.now());
            seboUser = userRepository.save(seboUser);
            usersCreated++;
        }

        User individualUser = userRepository.findByEmail("ana@codice.dev").orElse(null);
        if (individualUser == null) {
            individualUser = new User("ana@codice.dev", passwordHash, "Ana Leitora",
                    ProfileType.INDIVIDUAL_SELLER, OffsetDateTime.now());
            individualUser = userRepository.save(individualUser);
            usersCreated++;
        }

        // --- Sellers ---
        Seller sebo = sellerRepository.findByUserId(seboUser.getId()).orElse(null);
        if (sebo == null) {
            String seboSlug = slugService.generateSellerSlug("Sebo Letras Vivas");
            sebo = new Seller(seboUser, SellerType.BOOKSTORE, "Sebo Letras Vivas", seboSlug,
                    "Sebo especializado em literatura brasileira e ciencias humanas. Mais de 20 anos garimpando obras raras.",
                    "Sao Paulo", "SP");
            sebo = sellerRepository.save(sebo);
            sellersCreated++;
        }

        Seller ana = sellerRepository.findByUserId(individualUser.getId()).orElse(null);
        if (ana == null) {
            String anaSlug = slugService.generateSellerSlug("Ana Leitora");
            ana = new Seller(individualUser, SellerType.INDIVIDUAL, "Ana Leitora", anaSlug,
                    "Desapegando de livros que ja passaram pela minha estante. Todos bem cuidados.",
                    "Rio de Janeiro", "RJ");
            ana = sellerRepository.save(ana);
            sellersCreated++;
        }

        // --- Books ---
        List<Book> books = new ArrayList<>();
        booksCreated += seedBook(books, "Memorias Postumas de Bras Cubas", "Machado de Assis",
                "Companhia das Letras", 2008, null, "pt-BR", "9788535911725", null,
                new String[]{"Literatura Brasileira", "Classicos"},
                "Um defunto-autor narra suas memorias com ironia cortante e lucidez implacavel. "
                + "Machado de Assis subverte as convencoes do romance oitocentista para revelar, "
                + "entre digressoes e caprichos, a vaidade e as contradicoes da alma humana.");

        booksCreated += seedBook(books, "Casa-Grande & Senzala", "Gilberto Freyre",
                "Global Editora", 2003, "51a ed.", "pt-BR", "9788526008717", null,
                new String[]{"Sociologia", "Historia do Brasil", "Antropologia"},
                "Ensaio fundador da interpretacao do Brasil, em que Freyre investiga as raizes "
                + "da formacao social brasileira a partir das relacoes entre casa-grande e senzala. "
                + "Uma obra que moldou — e segue provocando — o modo como o pais se entende.");

        booksCreated += seedBook(books, "Formacao da Literatura Brasileira", "Antonio Candido",
                "Ouro sobre Azul", 2012, null, "pt-BR", "9788588777422", null,
                new String[]{"Literatura Brasileira", "Critica Literaria"},
                "Antonio Candido percorre dois seculos de producao literaria para demonstrar como "
                + "a literatura brasileira se constituiu enquanto sistema. Referencia incontornavel "
                + "para quem deseja compreender a tradicao letrada do pais.");

        booksCreated += seedBook(books, "Raizes do Brasil", "Sergio Buarque de Holanda",
                "Companhia das Letras", 1995, null, "pt-BR", "9788571644786", null,
                new String[]{"Historia do Brasil", "Sociologia"},
                "Sergio Buarque de Holanda examina as herancas ibericas que moldaram a sociedade "
                + "brasileira, do personalismo cordial a dificuldade de separar o publico do privado. "
                + "Um classico que permanece atual a cada releitura.");

        booksCreated += seedBook(books, "A Hora da Estrela", "Clarice Lispector",
                "Rocco", 1998, null, "pt-BR", "9788532511010", null,
                new String[]{"Literatura Brasileira"},
                "Macabea, nordestina perdida no Rio de Janeiro, vive uma existencia quase invisivel. "
                + "Clarice entrelaca a voz do narrador e a fragilidade da personagem numa narrativa "
                + "que interroga os limites da palavra e da compaixao.");

        booksCreated += seedBook(books, "Grande Sertao: Veredas", "Joao Guimaraes Rosa",
                "Nova Fronteira", 2006, null, "pt-BR", "9788520917022", null,
                new String[]{"Literatura Brasileira", "Classicos"},
                "Riobaldo narra sua travessia pelo sertao mineiro, entre jaguncos e pactos, "
                + "buscando decifrar o enigma de Diadorim. Guimaraes Rosa reinventa a lingua "
                + "portuguesa para dar voz a um Brasil arcaico e universal.");

        booksCreated += seedBook(books, "Vigiar e Punir", "Michel Foucault",
                "Vozes", 2014, "42a ed.", "pt-BR", "9788532605085", "Raquel Ramalhete",
                new String[]{"Filosofia", "Ciencias Sociais"},
                "Foucault investiga a genealogia das prisoes e dos mecanismos disciplinares que "
                + "moldaram a sociedade moderna. Do suplicio publico ao panoptico, uma reflexao "
                + "inquietante sobre poder, corpo e vigilancia.");

        booksCreated += seedBook(books, "O Cortico", "Aluisio Azevedo",
                "Atica", 2005, null, "pt-BR", "9788508107469", null,
                new String[]{"Literatura Brasileira", "Naturalismo"},
                "No microcosmo de um cortico carioca, Aluisio Azevedo compoe um painel vivo e "
                + "impiedoso da vida urbana no seculo XIX. Naturalismo em estado bruto, onde o "
                + "ambiente determina destinos e revela as entranhas de uma cidade em transformacao.");

        // --- Listings ---
        if (books.size() >= 8) {
            // 8 ACTIVE, 2 PENDING_REVIEW, 1 PAUSED, 1 SOLD = 12 total
            listingsCreated += seedListing(sebo, books.get(0), 3500, BookCondition.MUITO_BOM, ListingStatus.ACTIVE,
                    "Exemplar em otimo estado, lombada firme, paginas sem grifos.", 1);
            listingsCreated += seedListing(sebo, books.get(1), 8900, BookCondition.BOM, ListingStatus.ACTIVE,
                    "Edicao historica, capa com leve desgaste natural do tempo.", 2);
            listingsCreated += seedListing(sebo, books.get(2), 12000, BookCondition.COMO_NOVO, ListingStatus.ACTIVE,
                    "Praticamente intocado, comprado e guardado na estante.", 3);
            listingsCreated += seedListing(sebo, books.get(3), 4200, BookCondition.BOM, ListingStatus.ACTIVE,
                    "Algumas marcas de leitura a lapis, facilmente removiveis.", 4);
            listingsCreated += seedListing(sebo, books.get(6), 6500, BookCondition.MUITO_BOM, ListingStatus.ACTIVE,
                    "Traducao consagrada de Raquel Ramalhete, sem anotacoes.", 5);

            listingsCreated += seedListing(ana, books.get(4), 2800, BookCondition.COMO_NOVO, ListingStatus.ACTIVE,
                    "Li uma unica vez, guardei com carinho.", 6);
            listingsCreated += seedListing(ana, books.get(5), 5500, BookCondition.MUITO_BOM, ListingStatus.ACTIVE,
                    "Edicao da Nova Fronteira, encadernacao intacta.", 7);
            listingsCreated += seedListing(ana, books.get(7), 1900, BookCondition.BOM, ListingStatus.ACTIVE,
                    "Edicao escolar, capa flexivel em bom estado.", 8);

            // PENDING_REVIEW
            listingsCreated += seedListing(sebo, books.get(4), 3200, BookCondition.BOM, ListingStatus.PENDING_REVIEW,
                    "Edicao de bolso, algumas paginas com orelha.", 9);
            listingsCreated += seedListing(ana, books.get(0), 2500, BookCondition.ACEITAVEL, ListingStatus.PENDING_REVIEW,
                    "Capa com desgaste, miolo integro.", 10);

            // PAUSED
            listingsCreated += seedListing(sebo, books.get(5), 7800, BookCondition.NOVO, ListingStatus.PAUSED,
                    "Edicao lacrada, pausado temporariamente.", 11);

            // SOLD
            listingsCreated += seedListing(ana, books.get(3), 3800, BookCondition.MUITO_BOM, ListingStatus.SOLD,
                    "Ja encontrou um novo leitor.", 12);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("booksCreated", booksCreated);
        result.put("sellersCreated", sellersCreated);
        result.put("listingsCreated", listingsCreated);
        result.put("usersCreated", usersCreated);
        result.put("testCredentials", List.of(
                Map.of("email", "sebo@codice.dev", "password", "senha123", "role", "BOOKSTORE"),
                Map.of("email", "ana@codice.dev", "password", "senha123", "role", "INDIVIDUAL_SELLER")
        ));
        return result;
    }

    private int seedBook(List<Book> books, String title, String authors, String publisher,
                         int year, String edition, String language, String isbn,
                         String translator, String[] areas, String synopsis) {
        Book existing = bookRepository.findByIsbn(isbn).orElse(null);
        if (existing != null) {
            books.add(existing);
            return 0;
        }
        String slug = slugService.generateBookSlug(title);
        Book book = new Book(slug, title, authors, publisher, (short) year, edition, language,
                isbn, translator, areas, synopsis, null);
        books.add(bookRepository.save(book));
        return 1;
    }

    private int seedListing(Seller seller, Book book, int priceCents, BookCondition condition,
                            ListingStatus status, String description, int seedIndex) {
        if (listingRepository.existsByBookIdAndSellerIdAndStatus(book.getId(), seller.getId(), status)) {
            return 0;
        }
        Listing listing = new Listing(seller, book, priceCents, condition, null, description, status);
        addPhotos(listing, seedIndex);
        listingRepository.save(listing);
        return 1;
    }

    private void addPhotos(Listing listing, int seedIndex) {
        String base = "https://picsum.photos/seed/codice-" + seedIndex;
        listing.addPhoto(new ListingPhoto(listing, base + "-capa/400/600", (short) 0, PhotoType.COVER_FRONT));
        listing.addPhoto(new ListingPhoto(listing, base + "-lombada/400/600", (short) 1, PhotoType.SPINE_BACK));
        listing.addPhoto(new ListingPhoto(listing, base + "-detalhe/400/600", (short) 2, PhotoType.INNER_DETAIL));
    }
}
