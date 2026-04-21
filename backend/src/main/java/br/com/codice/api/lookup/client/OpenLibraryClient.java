package br.com.codice.api.lookup.client;

import br.com.codice.api.lookup.dto.BookLookupResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Optional;
import java.util.StringJoiner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class OpenLibraryClient {

    private static final Logger log = LoggerFactory.getLogger(OpenLibraryClient.class);
    private static final String BASE_URL = "https://openlibrary.org";
    private static final Pattern YEAR_PATTERN = Pattern.compile("(\\d{4})");
    private static final int MAX_AUTHOR_LOOKUPS = 3;

    private final RestClient restClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public OpenLibraryClient() {
        this.restClient = RestClient.builder()
                .baseUrl(BASE_URL)
                .build();
    }

    public Optional<BookLookupResponse> lookup(String isbn) {
        try {
            String body = restClient.get()
                    .uri("/isbn/{isbn}.json", isbn)
                    .retrieve()
                    .onStatus(HttpStatusCode::is4xxClientError, (req, res) -> {})
                    .body(String.class);

            if (body == null) {
                log.debug("Open Library: nenhum resultado para ISBN {}", isbn);
                return Optional.empty();
            }

            JsonNode root = objectMapper.readTree(body);

            if (root.has("error")) {
                log.debug("Open Library: erro na resposta para ISBN {}: {}", isbn, root.path("error").asText());
                return Optional.empty();
            }

            return Optional.of(parseBook(root, isbn));

        } catch (Exception e) {
            log.warn("Open Library: erro ao consultar ISBN {}: {}", isbn, e.getMessage());
            return Optional.empty();
        }
    }

    private BookLookupResponse parseBook(JsonNode root, String isbn) {
        String title = root.path("title").asText(null);
        String authors = resolveAuthors(root);
        String publisher = parsePublisher(root);
        Integer publicationYear = GoogleBooksClient.parseYear(textOrNull(root, "publish_date"));
        String description = parseDescription(root);
        String coverUrl = parseCoverUrl(root);
        Integer pageCount = root.has("number_of_pages") ? root.path("number_of_pages").asInt() : null;

        return new BookLookupResponse(
                title,
                authors,
                publisher,
                publicationYear,
                null,
                null,
                isbn,
                description,
                coverUrl,
                "OPEN_LIBRARY",
                pageCount
        );
    }

    private String resolveAuthors(JsonNode root) {
        JsonNode authorsNode = root.path("authors");
        if (!authorsNode.isArray() || authorsNode.isEmpty()) {
            return "Autor desconhecido";
        }

        StringJoiner joiner = new StringJoiner("; ");
        int count = 0;
        for (JsonNode authorRef : authorsNode) {
            if (count >= MAX_AUTHOR_LOOKUPS) break;

            String key = authorRef.path("key").asText(null);
            if (key == null) continue;

            String name = fetchAuthorName(key);
            if (name != null) {
                joiner.add(name);
            }
            count++;
        }

        return joiner.length() > 0 ? joiner.toString() : "Autor desconhecido";
    }

    private String fetchAuthorName(String authorKey) {
        try {
            String body = restClient.get()
                    .uri(authorKey + ".json")
                    .retrieve()
                    .onStatus(HttpStatusCode::is4xxClientError, (req, res) -> {})
                    .body(String.class);

            if (body == null) return null;

            JsonNode authorNode = objectMapper.readTree(body);
            return authorNode.path("name").asText(null);

        } catch (Exception e) {
            log.warn("Open Library: erro ao buscar autor {}: {}", authorKey, e.getMessage());
            return null;
        }
    }

    private String parsePublisher(JsonNode root) {
        JsonNode publishers = root.path("publishers");
        if (publishers.isArray() && !publishers.isEmpty()) {
            return publishers.get(0).asText(null);
        }
        return null;
    }

    private String parseDescription(JsonNode root) {
        JsonNode desc = root.path("description");
        if (desc.isMissingNode() || desc.isNull()) {
            return null;
        }
        if (desc.isTextual()) {
            return desc.asText();
        }
        if (desc.isObject()) {
            return desc.path("value").asText(null);
        }
        return null;
    }

    private String parseCoverUrl(JsonNode root) {
        JsonNode covers = root.path("covers");
        if (!covers.isArray() || covers.isEmpty()) {
            return null;
        }
        long coverId = covers.get(0).asLong(0);
        if (coverId == 0) return null;
        return "https://covers.openlibrary.org/b/id/" + coverId + "-L.jpg";
    }

    private static String textOrNull(JsonNode node, String field) {
        JsonNode value = node.path(field);
        return value.isMissingNode() || value.isNull() ? null : value.asText();
    }
}
