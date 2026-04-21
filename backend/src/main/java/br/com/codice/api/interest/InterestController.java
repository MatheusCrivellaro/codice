package br.com.codice.api.interest;

import br.com.codice.api.interest.dto.CreateInterestRequest;
import br.com.codice.api.interest.dto.MessageResponse;
import br.com.codice.api.interest.dto.SendMessageRequest;
import br.com.codice.api.interest.dto.ThreadResponse;
import br.com.codice.api.interest.dto.UnreadCountResponse;
import br.com.codice.api.user.User;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/interests")
public class InterestController {

    private final InterestService interestService;

    public InterestController(InterestService interestService) {
        this.interestService = interestService;
    }

    @PostMapping
    public ResponseEntity<ThreadResponse> createInterest(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateInterestRequest request) {
        var response = interestService.createInterest(user, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/threads")
    public Page<ThreadResponse> getMyThreads(
            @AuthenticationPrincipal User user,
            @PageableDefault(size = 10) Pageable pageable) {
        return interestService.getMyThreads(user, pageable);
    }

    @GetMapping("/threads/{threadId}/messages")
    public Page<MessageResponse> getThreadMessages(
            @AuthenticationPrincipal User user,
            @PathVariable UUID threadId,
            @PageableDefault(size = 50) Pageable pageable) {
        return interestService.getThreadMessages(user, threadId, pageable);
    }

    @PostMapping("/threads/{threadId}/messages")
    public ResponseEntity<MessageResponse> sendMessage(
            @AuthenticationPrincipal User user,
            @PathVariable UUID threadId,
            @Valid @RequestBody SendMessageRequest request) {
        var response = interestService.sendMessage(user, threadId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/unread-count")
    public UnreadCountResponse getUnreadCount(@AuthenticationPrincipal User user) {
        return interestService.getUnreadCount(user);
    }
}
