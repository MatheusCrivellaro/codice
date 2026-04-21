package br.com.codice.api.interest;

public class ThreadClosedException extends RuntimeException {
    public ThreadClosedException() {
        super("Esta conversa foi encerrada.");
    }
}
