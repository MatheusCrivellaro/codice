package br.com.codice.api.interest.dto;

import br.com.codice.api.interest.Message;

import java.time.OffsetDateTime;
import java.util.UUID;

public record MessageResponse(
        UUID id,
        UUID senderId,
        String senderName,
        boolean isMine,
        String content,
        OffsetDateTime createdAt
) {
    public static MessageResponse from(Message message, UUID currentUserId) {
        return new MessageResponse(
                message.getId(),
                message.getSender().getId(),
                message.getSender().getName(),
                message.getSender().getId().equals(currentUserId),
                message.getContent(),
                message.getCreatedAt()
        );
    }
}
