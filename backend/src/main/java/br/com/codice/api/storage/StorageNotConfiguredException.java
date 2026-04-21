package br.com.codice.api.storage;

public class StorageNotConfiguredException extends RuntimeException {
    public StorageNotConfiguredException() {
        super("Storage de arquivos nao esta configurado neste ambiente.");
    }
}
