package br.com.codice.api.interest;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ThreadReadStatusRepository extends JpaRepository<ThreadReadStatus, ThreadReadStatusId> {

    Optional<ThreadReadStatus> findById(ThreadReadStatusId id);
}
