package br.com.codice.api.book;

import br.com.codice.api.book.dto.BookListItem;
import br.com.codice.api.book.dto.BookResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public Page<BookListItem> list(@PageableDefault(size = 20) Pageable pageable) {
        return bookService.listBooksWithActiveListings(pageable);
    }

    @GetMapping("/{slug}")
    public BookResponse findBySlug(@PathVariable String slug) {
        return bookService.findBySlug(slug);
    }
}
