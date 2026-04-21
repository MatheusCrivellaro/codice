package br.com.codice.api.common;

import br.com.codice.api.book.BookRepository;
import br.com.codice.api.seller.SellerRepository;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.regex.Pattern;

@Service
public class SlugService {

    private static final Pattern NON_ALPHANUMERIC = Pattern.compile("[^a-z0-9\\-]");
    private static final Pattern MULTIPLE_HYPHENS = Pattern.compile("-{2,}");
    private static final int MAX_SLUG_LENGTH = 80;

    private final BookRepository bookRepository;
    private final SellerRepository sellerRepository;

    public SlugService(BookRepository bookRepository, SellerRepository sellerRepository) {
        this.bookRepository = bookRepository;
        this.sellerRepository = sellerRepository;
    }

    public String generateSlug(String text) {
        if (text == null || text.isBlank()) {
            return "";
        }
        String normalized = Normalizer.normalize(text, Normalizer.Form.NFD);
        String slug = normalized
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
                .toLowerCase()
                .replaceAll("\\s+", "-");
        slug = NON_ALPHANUMERIC.matcher(slug).replaceAll("");
        slug = MULTIPLE_HYPHENS.matcher(slug).replaceAll("-");
        slug = slug.replaceAll("^-|-$", "");
        if (slug.length() > MAX_SLUG_LENGTH) {
            slug = slug.substring(0, MAX_SLUG_LENGTH);
            slug = slug.replaceAll("-$", "");
        }
        return slug;
    }

    public String ensureUniqueBookSlug(String baseSlug) {
        String candidate = baseSlug;
        int suffix = 2;
        while (bookRepository.existsBySlug(candidate)) {
            candidate = baseSlug + "-" + suffix;
            suffix++;
        }
        return candidate;
    }

    public String ensureUniqueSellerSlug(String baseSlug) {
        String candidate = baseSlug;
        int suffix = 2;
        while (sellerRepository.existsBySlug(candidate)) {
            candidate = baseSlug + "-" + suffix;
            suffix++;
        }
        return candidate;
    }

    public String generateBookSlug(String title) {
        return ensureUniqueBookSlug(generateSlug(title));
    }

    public String generateSellerSlug(String name) {
        return ensureUniqueSellerSlug(generateSlug(name));
    }
}
