package br.com.codice.api.storage;

import br.com.codice.api.storage.dto.PresignedUploadRequest;
import br.com.codice.api.storage.dto.PresignedUploadResponse;
import br.com.codice.api.user.User;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/uploads")
public class UploadController {

    private static final int MAX_BATCH = 10;

    private final StorageService storageService;

    public UploadController(StorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping("/presign")
    public PresignedUploadResponse presign(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody PresignedUploadRequest request
    ) {
        return storageService.generatePresignedUploadUrl(user.getId(), request);
    }

    @PostMapping("/presign-batch")
    public List<PresignedUploadResponse> presignBatch(
            @AuthenticationPrincipal User user,
            @RequestBody List<@Valid PresignedUploadRequest> requests
    ) {
        if (requests == null || requests.isEmpty()) {
            throw new InvalidUploadException("Informe pelo menos um arquivo.");
        }
        if (requests.size() > MAX_BATCH) {
            throw new InvalidUploadException("Maximo " + MAX_BATCH + " arquivos por chamada.");
        }
        return requests.stream()
                .map(req -> storageService.generatePresignedUploadUrl(user.getId(), req))
                .toList();
    }
}
