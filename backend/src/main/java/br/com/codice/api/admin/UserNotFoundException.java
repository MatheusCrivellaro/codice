package br.com.codice.api.admin;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(String email) {
        super("Usuario nao encontrado: " + email);
    }
}
