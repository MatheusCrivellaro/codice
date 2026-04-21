package br.com.codice.api.interest;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.OffsetDateTime;

@Entity
@Table(name = "thread_read_status")
public class ThreadReadStatus {

    @EmbeddedId
    private ThreadReadStatusId id;

    @Column(name = "last_read_at", nullable = false)
    private OffsetDateTime lastReadAt;

    protected ThreadReadStatus() {
    }

    public ThreadReadStatus(ThreadReadStatusId id, OffsetDateTime lastReadAt) {
        this.id = id;
        this.lastReadAt = lastReadAt;
    }

    public ThreadReadStatusId getId() {
        return id;
    }

    public OffsetDateTime getLastReadAt() {
        return lastReadAt;
    }

    public void setLastReadAt(OffsetDateTime lastReadAt) {
        this.lastReadAt = lastReadAt;
    }
}
