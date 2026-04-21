package br.com.codice.api.interest;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class ThreadReadStatusId implements Serializable {

    @Column(name = "thread_id")
    private UUID threadId;

    @Column(name = "user_id")
    private UUID userId;

    protected ThreadReadStatusId() {
    }

    public ThreadReadStatusId(UUID threadId, UUID userId) {
        this.threadId = threadId;
        this.userId = userId;
    }

    public UUID getThreadId() {
        return threadId;
    }

    public UUID getUserId() {
        return userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ThreadReadStatusId that = (ThreadReadStatusId) o;
        return Objects.equals(threadId, that.threadId) && Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(threadId, userId);
    }
}
