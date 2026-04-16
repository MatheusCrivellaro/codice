package br.com.codice.api.auth;

public class EmailAlreadyInUseException extends RuntimeException {

    public EmailAlreadyInUseException(String email) {
        super("Email já está em uso: " + email);
    }
}
