package br.com.codice.api.interest;

public class NotThreadParticipantException extends RuntimeException {
    public NotThreadParticipantException() {
        super("Voce nao tem acesso a esta conversa.");
    }
}
