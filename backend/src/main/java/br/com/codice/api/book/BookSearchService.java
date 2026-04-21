package br.com.codice.api.book;

import br.com.codice.api.book.dto.BookSearchResult;
import br.com.codice.api.listing.BookCondition;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class BookSearchService {

    private static final List<BookCondition> CONDITION_HIERARCHY = List.of(
            BookCondition.ACEITAVEL,
            BookCondition.BOM,
            BookCondition.MUITO_BOM,
            BookCondition.COMO_NOVO,
            BookCondition.NOVO
    );

    private final EntityManager entityManager;

    public BookSearchService(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Transactional(readOnly = true)
    public Page<BookSearchResult> search(
            String q,
            String area,
            String condition,
            Integer priceMin,
            Integer priceMax,
            String state,
            String sort,
            Pageable pageable) {

        boolean hasQuery = q != null && !q.isBlank();
        boolean useFuzzy = false;

        // First try full-text if query present
        if (hasQuery) {
            Page<BookSearchResult> results = executeSearch(q, area, condition, priceMin, priceMax, state, sort, pageable, false);
            if (results.getTotalElements() > 0) {
                return results;
            }
            // Fallback to fuzzy
            useFuzzy = true;
        }

        return executeSearch(q, area, condition, priceMin, priceMax, state, sort, pageable, useFuzzy);
    }

    @SuppressWarnings("unchecked")
    private Page<BookSearchResult> executeSearch(
            String q,
            String area,
            String condition,
            Integer priceMin,
            Integer priceMax,
            String state,
            String sort,
            Pageable pageable,
            boolean fuzzy) {

        boolean hasQuery = q != null && !q.isBlank();
        Map<String, Object> params = new HashMap<>();

        // Build WHERE clauses
        List<String> whereClauses = new ArrayList<>();
        whereClauses.add("l.status = 'ACTIVE'");

        if (hasQuery && !fuzzy) {
            whereClauses.add("b.search_vector @@ plainto_tsquery('portuguese', :q)");
            params.put("q", q);
        } else if (hasQuery) {
            whereClauses.add("similarity(b.title::text, :q) > 0.15");
            params.put("q", q);
        }

        if (area != null && !area.isBlank()) {
            whereClauses.add("b.academic_areas @> ARRAY[:area]::text[]");
            params.put("area", area);
        }

        if (condition != null && !condition.isBlank()) {
            List<String> conditions = conditionsAtOrAbove(condition);
            if (!conditions.isEmpty()) {
                whereClauses.add("l.condition IN (:conditions)");
                params.put("conditions", conditions);
            }
        }

        if (priceMin != null) {
            whereClauses.add("l.price_cents >= :priceMin");
            params.put("priceMin", priceMin);
        }

        if (priceMax != null) {
            whereClauses.add("l.price_cents <= :priceMax");
            params.put("priceMax", priceMax);
        }

        if (state != null && !state.isBlank()) {
            whereClauses.add("s.state = :state");
            params.put("state", state);
        }

        String whereClause = String.join(" AND ", whereClauses);

        // Relevance column
        String relevanceCol;
        if (hasQuery && !fuzzy) {
            relevanceCol = "ts_rank(b.search_vector, plainto_tsquery('portuguese', :q))";
        } else if (hasQuery) {
            relevanceCol = "similarity(b.title::text, :q)";
        } else {
            relevanceCol = "NULL::float";
        }

        // Order by
        String orderBy = resolveOrderBy(sort, hasQuery);

        // Data query
        String dataSql = """
                SELECT b.id, b.slug, b.title, b.authors, b.cover_image_url, b.academic_areas,
                       COUNT(l.id) AS active_listings_count,
                       MIN(l.price_cents) AS lowest_price_cents,
                       %s AS relevance_score
                FROM books b
                JOIN listings l ON l.book_id = b.id
                JOIN sellers s ON s.id = l.seller_id
                WHERE %s
                GROUP BY b.id
                ORDER BY %s
                """.formatted(relevanceCol, whereClause, orderBy);

        // Count query
        String countSql = """
                SELECT COUNT(DISTINCT b.id)
                FROM books b
                JOIN listings l ON l.book_id = b.id
                JOIN sellers s ON s.id = l.seller_id
                WHERE %s
                """.formatted(whereClause);

        Query dataQuery = entityManager.createNativeQuery(dataSql);
        Query countQuery = entityManager.createNativeQuery(countSql);

        for (var entry : params.entrySet()) {
            if ("conditions".equals(entry.getKey())) {
                // For IN clause, need to handle differently
                continue;
            }
            dataQuery.setParameter(entry.getKey(), entry.getValue());
            countQuery.setParameter(entry.getKey(), entry.getValue());
        }

        // Handle conditions IN clause by replacing placeholder
        if (params.containsKey("conditions")) {
            @SuppressWarnings("unchecked")
            List<String> conditions = (List<String>) params.get("conditions");
            // Replace the named parameter with literal values for the IN clause
            String inList = conditions.stream()
                    .map(c -> "'" + c + "'")
                    .reduce((a, b) -> a + "," + b)
                    .orElse("''");

            // We need to recreate queries with literal IN values since JPA native queries
            // don't reliably support list parameters in all drivers
            String fixedWhere = whereClause.replace("l.condition IN (:conditions)", "l.condition IN (" + inList + ")");
            String fixedDataSql = """
                    SELECT b.id, b.slug, b.title, b.authors, b.cover_image_url, b.academic_areas,
                           COUNT(l.id) AS active_listings_count,
                           MIN(l.price_cents) AS lowest_price_cents,
                           %s AS relevance_score
                    FROM books b
                    JOIN listings l ON l.book_id = b.id
                    JOIN sellers s ON s.id = l.seller_id
                    WHERE %s
                    GROUP BY b.id
                    ORDER BY %s
                    """.formatted(relevanceCol, fixedWhere, orderBy);
            String fixedCountSql = """
                    SELECT COUNT(DISTINCT b.id)
                    FROM books b
                    JOIN listings l ON l.book_id = b.id
                    JOIN sellers s ON s.id = l.seller_id
                    WHERE %s
                    """.formatted(fixedWhere);

            dataQuery = entityManager.createNativeQuery(fixedDataSql);
            countQuery = entityManager.createNativeQuery(fixedCountSql);

            for (var entry : params.entrySet()) {
                if ("conditions".equals(entry.getKey())) continue;
                dataQuery.setParameter(entry.getKey(), entry.getValue());
                countQuery.setParameter(entry.getKey(), entry.getValue());
            }
        }

        dataQuery.setFirstResult((int) pageable.getOffset());
        dataQuery.setMaxResults(pageable.getPageSize());

        List<Object[]> rows = dataQuery.getResultList();
        long total = ((Number) countQuery.getSingleResult()).longValue();

        List<BookSearchResult> results = rows.stream()
                .map(this::mapRow)
                .toList();

        return new PageImpl<>(results, pageable, total);
    }

    private BookSearchResult mapRow(Object[] row) {
        UUID id = (UUID) row[0];
        String slug = (String) row[1];
        String title = (String) row[2];
        String authors = (String) row[3];
        String coverImageUrl = (String) row[4];

        // academic_areas comes as a String[] or null from Postgres array
        List<String> areas = List.of();
        if (row[5] != null) {
            if (row[5] instanceof String[]) {
                areas = Arrays.asList((String[]) row[5]);
            } else if (row[5] instanceof Object[]) {
                areas = Arrays.stream((Object[]) row[5])
                        .map(Object::toString)
                        .toList();
            }
        }

        int count = ((Number) row[6]).intValue();
        Integer lowestPrice = row[7] != null ? ((Number) row[7]).intValue() : null;
        Double relevance = row[8] != null ? ((Number) row[8]).doubleValue() : null;

        return new BookSearchResult(id, slug, title, authors, coverImageUrl, areas, count, lowestPrice, relevance);
    }

    private String resolveOrderBy(String sort, boolean hasQuery) {
        if (sort == null || sort.isBlank()) {
            return hasQuery ? "relevance_score DESC, b.title" : "b.created_at DESC";
        }
        return switch (sort) {
            case "relevance" -> "relevance_score DESC, b.title";
            case "price_asc" -> "lowest_price_cents ASC, b.title";
            case "price_desc" -> "lowest_price_cents DESC, b.title";
            case "newest" -> "b.created_at DESC";
            default -> hasQuery ? "relevance_score DESC, b.title" : "b.created_at DESC";
        };
    }

    private List<String> conditionsAtOrAbove(String minCondition) {
        try {
            BookCondition min = BookCondition.valueOf(minCondition);
            int idx = CONDITION_HIERARCHY.indexOf(min);
            if (idx < 0) return List.of();
            return CONDITION_HIERARCHY.subList(idx, CONDITION_HIERARCHY.size()).stream()
                    .map(Enum::name)
                    .toList();
        } catch (IllegalArgumentException e) {
            return List.of();
        }
    }
}
