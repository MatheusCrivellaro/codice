package br.com.codice.api.common;

import br.com.codice.api.admin.ListingNotFoundException;
import br.com.codice.api.admin.UserNotFoundException;
import br.com.codice.api.auth.EmailAlreadyInUseException;
import br.com.codice.api.auth.InvalidCredentialsException;
import br.com.codice.api.book.BookNotFoundException;
import br.com.codice.api.interest.ListingNotActiveException;
import br.com.codice.api.interest.NotThreadParticipantException;
import br.com.codice.api.interest.SelfInterestException;
import br.com.codice.api.interest.ThreadClosedException;
import br.com.codice.api.interest.ThreadNotFoundException;
import br.com.codice.api.listing.BookstoreNeedsProfileException;
import br.com.codice.api.listing.InvalidListingRequestException;
import br.com.codice.api.lookup.InvalidIsbnException;
import br.com.codice.api.seller.BuyerCannotSellException;
import br.com.codice.api.seller.SellerProfileAlreadyExistsException;
import br.com.codice.api.storage.InvalidUploadException;
import br.com.codice.api.storage.StorageNotConfiguredException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        List<Map<String, String>> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> Map.of(
                        "field", fe.getField(),
                        "message", fe.getDefaultMessage() != null ? fe.getDefaultMessage() : "Valor inválido"
                ))
                .toList();

        return ResponseEntity.badRequest().body(Map.of(
                "status", 400,
                "error", "Erro de validação",
                "details", errors
        ));
    }

    @ExceptionHandler(EmailAlreadyInUseException.class)
    public ResponseEntity<Map<String, Object>> handleEmailInUse(EmailAlreadyInUseException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                "status", 409,
                "error", ex.getMessage()
        ));
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidCredentials(InvalidCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                "status", 401,
                "error", ex.getMessage()
        ));
    }

    @ExceptionHandler(BookNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleBookNotFound(BookNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "status", 404,
                "error", ex.getMessage()
        ));
    }

    @ExceptionHandler(ListingNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleListingNotFound(ListingNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "status", 404,
                "error", ex.getMessage()
        ));
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleUserNotFound(UserNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "status", 404,
                "error", ex.getMessage()
        ));
    }

    @ExceptionHandler(BuyerCannotSellException.class)
    public ResponseEntity<Map<String, Object>> handleBuyerCannotSell(BuyerCannotSellException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                "status", 403,
                "error", ex.getMessage()
        ));
    }

    @ExceptionHandler(BookstoreNeedsProfileException.class)
    public ResponseEntity<Map<String, Object>> handleBookstoreNeedsProfile(BookstoreNeedsProfileException ex) {
        return ResponseEntity.badRequest().body(Map.of(
                "status", 400,
                "error", ex.getMessage()
        ));
    }

    @ExceptionHandler(InvalidListingRequestException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidListingRequest(InvalidListingRequestException ex) {
        return ResponseEntity.badRequest().body(Map.of(
                "status", 400,
                "error", ex.getMessage()
        ));
    }

    @ExceptionHandler(SellerProfileAlreadyExistsException.class)
    public ResponseEntity<Map<String, Object>> handleSellerAlreadyExists(SellerProfileAlreadyExistsException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                "status", 409,
                "error", ex.getMessage()
        ));
    }

    @ExceptionHandler(SelfInterestException.class)
    public ResponseEntity<Map<String, Object>> handleSelfInterest(SelfInterestException ex) {
        return ResponseEntity.badRequest().body(Map.of(
                "status", 400,
                "error", ex.getMessage()
        ));
    }

    @ExceptionHandler(ListingNotActiveException.class)
    public ResponseEntity<Map<String, Object>> handleListingNotActive(ListingNotActiveException ex) {
        return ResponseEntity.badRequest().body(Map.of(
                "status", 400,
                "error", ex.getMessage()
        ));
    }

    @ExceptionHandler(ThreadClosedException.class)
    public ResponseEntity<Map<String, Object>> handleThreadClosed(ThreadClosedException ex) {
        return ResponseEntity.badRequest().body(Map.of(
                "status", 400,
                "error", ex.getMessage()
        ));
    }

    @ExceptionHandler(ThreadNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleThreadNotFound(ThreadNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "status", 404,
                "error", ex.getMessage()
        ));
    }

    @ExceptionHandler(NotThreadParticipantException.class)
    public ResponseEntity<Map<String, Object>> handleNotParticipant(NotThreadParticipantException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                "status", 403,
                "error", ex.getMessage()
        ));
    }

    @ExceptionHandler(InvalidIsbnException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidIsbn(InvalidIsbnException ex) {
        return ResponseEntity.badRequest().body(Map.of(
                "message", "ISBN invalido. Informe 10 ou 13 digitos."
        ));
    }

    @ExceptionHandler(InvalidUploadException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidUpload(InvalidUploadException ex) {
        return ResponseEntity.badRequest().body(Map.of(
                "status", 400,
                "error", ex.getMessage()
        ));
    }

    @ExceptionHandler(StorageNotConfiguredException.class)
    public ResponseEntity<Map<String, Object>> handleStorageNotConfigured(StorageNotConfiguredException ex) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(
                "status", 503,
                "error", ex.getMessage()
        ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
        log.error("Erro inesperado", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "status", 500,
                "error", "Erro interno do servidor"
        ));
    }
}
