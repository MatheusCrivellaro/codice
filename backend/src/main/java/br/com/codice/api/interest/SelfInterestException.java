package br.com.codice.api.interest;

public class SelfInterestException extends RuntimeException {
    public SelfInterestException() {
        super("Voce nao pode manifestar interesse no proprio anuncio.");
    }
}
