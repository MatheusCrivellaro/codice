package br.com.codice.api.lookup.client;

import br.com.codice.api.lookup.dto.BookLookupResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.Optional;
import java.util.StringJoiner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class GoogleBooksClient {

    private static final Logger log = LoggerFactory.getLogger(GoogleBooksClient.class);
    private static final String BASE_URL = "https://www.googleapis.com/books/v1/volumes";
    private static final Pattern YEAR_PATTERN = Pattern.compile("(\\d{4})");

    private final RestClient restClient;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String apiKey;

    public GoogleBooksClient(
            @Value("${codice.google-books.api-key:}") String apiKey) {
        this.apiKey = apiKey;
        this.restClient = RestClient.builder()
                .baseUrl(BASE_URL)
                .requestInterceptor((request, body, execution) -> {
                    request.getHeaders().set("Accept", "application/json");
                    return execution.execute(request, body);
                })
                .build();
    }

    public Optional<BookLookupResponse> lookup(String isbn) {
        try {
            StringBuilder uri = new StringBuilder("?q=isbn:" + isbn);
            if (apiKey != null && !apiKey.isBlank()) {
                uri.append("&key=").append(apiKey);
            }

            String body = restClient.get()
                    .uri(uri.toString())
                    .retrieve()
                    .body(String.class);

            if (body == null) {
                log.warn("Google Books: resposta vazia para ISBN {}", isbn);
                return Optional.empty();
            }

            JsonNode root = objectMapper.readTree(body);
            int totalItems = root.path("totalItems").asInt(0);
            if (totalItems == 0) {
                log.debug("Google Books: nenhum resultado para ISBN {}", isbn);
                return Optional.empty();
            }

            JsonNode volumeInfo = root.path("items").path(0).path("volumeInfo");
            if (volumeInfo.isMissingNode()) {
                return Optional.empty();
            }

            return Optional.of(parseVolumeInfo(volumeInfo, isbn));

        } catch (Exception e) {
            log.warn("Google Books: erro ao consultar ISBN {}: {}", isbn, e.getMessage());
            return Optional.empty();
        }
    }

    private BookLookupResponse parseVolumeInfo(JsonNode info, String isbn) {
        String title = info.path("title").asText(null);

        String authors = parseAuthors(info);
        String publisher = textOrNull(info, "publisher");
        Integer publicationYear = parseYear(textOrNull(info, "publishedDate"));
        String language = normalizeLanguage(textOrNull(info, "language"));
        String description = textOrNull(info, "description");
        Integer pageCount = info.has("pageCount") ? info.path("pageCount").asInt() : null;
        String coverUrl = parseCoverUrl(info);

        return new BookLookupResponse(
                title,
                authors,
                publisher,
                publicationYear,
                null,
                language,
                isbn,
                description,
                coverUrl,
                "GOOGLE_BOOKS",
                pageCount
        );
    }

    private String parseAuthors(JsonNode info) {
        JsonNode authorsNode = info.path("authors");
        if (!authorsNode.isArray() || authorsNode.isEmpty()) {
            return "Autor desconhecido";
        }
        StringJoiner joiner = new StringJoiner("; ");
        for (JsonNode author : authorsNode) {
            joiner.add(author.asText());
        }
        return joiner.toString();
    }

    private String parseCoverUrl(JsonNode info) {
        String thumbnail = info.path("imageLinks").path("thumbnail").asText(null);
        if (thumbnail == null) {
            return null;
        }
        return thumbnail
                .replace("http://", "https://")
                .replace("&zoom=1", "&zoom=2");
    }

    static Integer parseYear(String dateStr) {
        if (dateStr == null) {
            return null;
        }
        Matcher m = YEAR_PATTERN.matcher(dateStr);
        return m.find() ? Integer.parseInt(m.group(1)) : null;
    }

    static String normalizeLanguage(String lang) {
        if (lang == null) {
            return null;
        }
        return switch (lang.toLowerCase()) {
            case "pt-br", "pt_br" -> "pt-BR";
            case "pt" -> "pt";
            case "en" -> "en";
            case "es" -> "es";
            case "fr" -> "fr";
            case "de" -> "de";
            case "it" -> "it";
            default -> lang.toLowerCase();
        };
    }

    private static String textOrNull(JsonNode node, String field) {
        JsonNode value = node.path(field);
        return value.isMissingNode() || value.isNull() ? null : value.asText();
    }
}
