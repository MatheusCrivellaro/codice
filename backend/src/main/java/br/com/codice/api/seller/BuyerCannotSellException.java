package br.com.codice.api.seller;

public class BuyerCannotSellException extends RuntimeException {

    public BuyerCannotSellException() {
        super("Compradores nao podem anunciar livros. Altere seu perfil para vendedor.");
    }
}
