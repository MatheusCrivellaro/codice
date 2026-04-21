package br.com.codice.api.book;

import br.com.codice.api.book.dto.BookDetailResponse;
import br.com.codice.api.book.dto.BookFuzzyMatch;
import br.com.codice.api.book.dto.BookListItem;
import br.com.codice.api.book.dto.BookResponse;
import br.com.codice.api.book.dto.BookSearchResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/books")
public class BookController {

    private final BookService bookService;
    private final BookSearchService bookSearchService;

    public BookController(BookService bookService, BookSearchService bookSearchService) {
        this.bookService = bookService;
        this.bookSearchService = bookSearchService;
    }

    @GetMapping
    public Page<BookListItem> list(@PageableDefault(size = 20) Pageable pageable) {
        return bookService.listBooksWithActiveListings(pageable);
    }

    @GetMapping("/search")
    public Page<BookSearchResult> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String area,
            @RequestParam(required = false) String condition,
            @RequestParam(required = false) Integer priceMin,
            @RequestParam(required = false) Integer priceMax,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String sort,
            @PageableDefault(size = 20) Pageable pageable) {
        return bookSearchService.search(q, area, condition, priceMin, priceMax, state, sort, pageable);
    }

    @GetMapping("/search/fuzzy")
    public List<BookFuzzyMatch> fuzzySearch(@RequestParam String title) {
        return bookService.fuzzySearch(title);
    }

    @GetMapping("/academic-areas")
    public List<String> academicAreas() {
        return bookService.getAcademicAreas();
    }

    @GetMapping("/{slug}")
    public BookDetailResponse findBySlug(@PathVariable String slug) {
        return bookService.findDetailBySlug(slug);
    }
}
