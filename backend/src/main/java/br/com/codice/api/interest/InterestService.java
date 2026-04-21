package br.com.codice.api.interest;

import br.com.codice.api.common.PriceFormatter;
import br.com.codice.api.interest.dto.CreateInterestRequest;
import br.com.codice.api.interest.dto.MessageResponse;
import br.com.codice.api.interest.dto.SendMessageRequest;
import br.com.codice.api.interest.dto.ThreadResponse;
import br.com.codice.api.interest.dto.UnreadCountResponse;
import br.com.codice.api.listing.Listing;
import br.com.codice.api.listing.ListingRepository;
import br.com.codice.api.listing.ListingStatus;
import br.com.codice.api.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class InterestService {

    private final InterestThreadRepository threadRepository;
    private final MessageRepository messageRepository;
    private final ThreadReadStatusRepository readStatusRepository;
    private final ListingRepository listingRepository;

    public InterestService(InterestThreadRepository threadRepository,
                           MessageRepository messageRepository,
                           ThreadReadStatusRepository readStatusRepository,
                           ListingRepository listingRepository) {
        this.threadRepository = threadRepository;
        this.messageRepository = messageRepository;
        this.readStatusRepository = readStatusRepository;
        this.listingRepository = listingRepository;
    }

    @Transactional
    public ThreadResponse createInterest(User buyer, CreateInterestRequest request) {
        Listing listing = listingRepository.findById(request.listingId())
                .orElseThrow(() -> new br.com.codice.api.admin.ListingNotFoundException(request.listingId()));

        if (listing.getStatus() != ListingStatus.ACTIVE) {
            throw new ListingNotActiveException();
        }

        UUID sellerUserId = listing.getSeller().getUser().getId();
        if (sellerUserId.equals(buyer.getId())) {
            throw new SelfInterestException();
        }

        Optional<InterestThread> existing = threadRepository.findByListingIdAndBuyerId(
                request.listingId(), buyer.getId());

        InterestThread thread;
        if (existing.isPresent()) {
            thread = existing.get();
        } else {
            thread = new InterestThread(listing, buyer);
            thread = threadRepository.save(thread);

            // Create read status for both participants
            readStatusRepository.save(new ThreadReadStatus(
                    new ThreadReadStatusId(thread.getId(), buyer.getId()),
                    OffsetDateTime.now()));
            readStatusRepository.save(new ThreadReadStatus(
                    new ThreadReadStatusId(thread.getId(), sellerUserId),
                    OffsetDateTime.now()));
        }

        // Add the message
        OffsetDateTime now = OffsetDateTime.now();
        Message message = new Message(thread, buyer, request.message());
        messageRepository.save(message);

        thread.setLastMessageAt(now);
        threadRepository.save(thread);

        // Update buyer's read status to now (they just wrote it)
        upsertReadStatus(thread.getId(), buyer.getId(), now);

        return toThreadResponse(thread, buyer.getId());
    }

    @Transactional(readOnly = true)
    public Page<ThreadResponse> getMyThreads(User user, Pageable pageable) {
        Page<InterestThread> threads = threadRepository.findByParticipantUserId(user.getId(), pageable);
        return threads.map(t -> toThreadResponse(t, user.getId()));
    }

    @Transactional
    public Page<MessageResponse> getThreadMessages(User user, UUID threadId, Pageable pageable) {
        InterestThread thread = threadRepository.findById(threadId)
                .orElseThrow(() -> new ThreadNotFoundException(threadId));

        validateParticipant(thread, user.getId());

        // Mark as read
        upsertReadStatus(threadId, user.getId(), OffsetDateTime.now());

        Page<Message> messages = messageRepository.findByThreadIdOrderByCreatedAtAsc(threadId, pageable);
        return messages.map(m -> MessageResponse.from(m, user.getId()));
    }

    @Transactional
    public MessageResponse sendMessage(User user, UUID threadId, SendMessageRequest request) {
        InterestThread thread = threadRepository.findById(threadId)
                .orElseThrow(() -> new ThreadNotFoundException(threadId));

        validateParticipant(thread, user.getId());

        if (thread.getStatus() != ThreadStatus.OPEN) {
            throw new ThreadClosedException();
        }

        OffsetDateTime now = OffsetDateTime.now();
        Message message = new Message(thread, user, request.content());
        messageRepository.save(message);

        thread.setLastMessageAt(now);
        threadRepository.save(thread);

        // Sender has read up to now
        upsertReadStatus(threadId, user.getId(), now);

        return MessageResponse.from(message, user.getId());
    }

    @Transactional(readOnly = true)
    public UnreadCountResponse getUnreadCount(User user) {
        int count = threadRepository.countThreadsWithUnreadMessages(user.getId());
        return new UnreadCountResponse(count);
    }

    private void validateParticipant(InterestThread thread, UUID userId) {
        UUID buyerId = thread.getBuyer().getId();
        UUID sellerUserId = thread.getListing().getSeller().getUser().getId();
        if (!userId.equals(buyerId) && !userId.equals(sellerUserId)) {
            throw new NotThreadParticipantException();
        }
    }

    private void upsertReadStatus(UUID threadId, UUID userId, OffsetDateTime readAt) {
        ThreadReadStatusId id = new ThreadReadStatusId(threadId, userId);
        Optional<ThreadReadStatus> existing = readStatusRepository.findById(id);
        if (existing.isPresent()) {
            existing.get().setLastReadAt(readAt);
            readStatusRepository.save(existing.get());
        } else {
            readStatusRepository.save(new ThreadReadStatus(id, readAt));
        }
    }

    private ThreadResponse toThreadResponse(InterestThread thread, UUID currentUserId) {
        Listing listing = thread.getListing();
        UUID buyerId = thread.getBuyer().getId();
        UUID sellerUserId = listing.getSeller().getUser().getId();

        boolean isBuyer = currentUserId.equals(buyerId);
        String counterpartName = isBuyer
                ? listing.getSeller().getPublicName()
                : thread.getBuyer().getName();
        String counterpartType = isBuyer ? "seller" : "buyer";

        // Unread count
        ThreadReadStatusId rsId = new ThreadReadStatusId(thread.getId(), currentUserId);
        OffsetDateTime lastRead = readStatusRepository.findById(rsId)
                .map(ThreadReadStatus::getLastReadAt)
                .orElse(OffsetDateTime.MIN);
        int unreadCount = messageRepository.countUnreadForUser(thread.getId(), lastRead, currentUserId);

        // Last message preview
        String lastMessagePreview = messageRepository.findLastByThreadId(thread.getId())
                .map(m -> m.getContent().length() > 100
                        ? m.getContent().substring(0, 100) + "..."
                        : m.getContent())
                .orElse(null);

        return new ThreadResponse(
                thread.getId(),
                listing.getId(),
                listing.getBook().getTitle(),
                listing.getBook().getSlug(),
                listing.getBook().getCoverImageUrl(),
                listing.getPriceCents(),
                PriceFormatter.format(listing.getPriceCents()),
                listing.getCondition().name(),
                counterpartName,
                counterpartType,
                thread.getStatus().name(),
                unreadCount,
                lastMessagePreview,
                thread.getLastMessageAt(),
                thread.getCreatedAt()
        );
    }
}
