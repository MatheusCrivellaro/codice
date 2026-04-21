package br.com.codice.api.lookup;

import br.com.codice.api.lookup.dto.BookLookupResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/lookup")
public class LookupController {

    private final BookLookupService bookLookupService;

    public LookupController(BookLookupService bookLookupService) {
        this.bookLookupService = bookLookupService;
    }

    @GetMapping("/isbn/{isbn}")
    public ResponseEntity<Object> lookupByIsbn(@PathVariable String isbn) {
        var result = bookLookupService.lookup(isbn);
        return result.<ResponseEntity<Object>>map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(404)
                .body(Map.of("message", "Nenhum livro encontrado para o ISBN informado.")));
    }
}
