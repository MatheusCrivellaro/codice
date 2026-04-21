package br.com.codice.api.listing;

public class InvalidListingRequestException extends RuntimeException {

    public InvalidListingRequestException(String message) {
        super(message);
    }
}
