package br.com.codice.api.seller;

public class SellerProfileAlreadyExistsException extends RuntimeException {

    public SellerProfileAlreadyExistsException() {
        super("Perfil de vendedor ja existe.");
    }
}
