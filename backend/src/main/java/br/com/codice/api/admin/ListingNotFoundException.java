package br.com.codice.api.admin;

import java.util.UUID;

public class ListingNotFoundException extends RuntimeException {

    public ListingNotFoundException(UUID id) {
        super("Anuncio nao encontrado: " + id);
    }
}
