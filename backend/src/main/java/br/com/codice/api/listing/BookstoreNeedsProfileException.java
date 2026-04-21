package br.com.codice.api.listing;

public class BookstoreNeedsProfileException extends RuntimeException {

    public BookstoreNeedsProfileException() {
        super("Sebos precisam completar o perfil da loja antes de anunciar. Acesse /vender/perfil.");
    }
}
