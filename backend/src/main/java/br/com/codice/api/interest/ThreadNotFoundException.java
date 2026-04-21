package br.com.codice.api.interest;

import java.util.UUID;

public class ThreadNotFoundException extends RuntimeException {
    public ThreadNotFoundException(UUID id) {
        super("Conversa nao encontrada: " + id);
    }
}
