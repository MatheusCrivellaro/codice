package br.com.codice.api.interest;

public class ListingNotActiveException extends RuntimeException {
    public ListingNotActiveException() {
        super("Este anuncio nao esta disponivel.");
    }
}
