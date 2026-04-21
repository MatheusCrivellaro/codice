package br.com.codice.api.lookup;

public class InvalidIsbnException extends RuntimeException {

    public InvalidIsbnException(String isbn) {
        super("ISBN invalido: " + isbn);
    }
}
