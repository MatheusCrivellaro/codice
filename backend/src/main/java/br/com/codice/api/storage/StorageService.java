package br.com.codice.api.storage;

import br.com.codice.api.storage.dto.PresignedUploadRequest;
import br.com.codice.api.storage.dto.PresignedUploadResponse;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Service
public class StorageService {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp"
    );
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "jpg", "jpeg", "png", "webp"
    );
    private static final Duration UPLOAD_URL_TTL = Duration.ofMinutes(15);

    private final StorageProperties properties;
    private final ObjectProvider<S3Client> s3ClientProvider;
    private final ObjectProvider<S3Presigner> s3PresignerProvider;

    public StorageService(
            StorageProperties properties,
            ObjectProvider<S3Client> s3ClientProvider,
            ObjectProvider<S3Presigner> s3PresignerProvider
    ) {
        this.properties = properties;
        this.s3ClientProvider = s3ClientProvider;
        this.s3PresignerProvider = s3PresignerProvider;
    }

    public PresignedUploadResponse generatePresignedUploadUrl(UUID userId, PresignedUploadRequest request) {
        requireConfigured();

        var contentType = request.contentType().toLowerCase();
        if (!ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new InvalidUploadException(
                    "Content type nao suportado: " + request.contentType()
                            + ". Permitidos: image/jpeg, image/png, image/webp."
            );
        }

        var extension = extractExtension(request.filename());
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new InvalidUploadException(
                    "Extensao nao suportada: ." + extension + ". Permitidas: jpg, jpeg, png, webp."
            );
        }

        var key = buildKey(userId, extension);

        var putRequest = PutObjectRequest.builder()
                .bucket(properties.bucket())
                .key(key)
                .contentType(contentType)
                .build();

        var presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(UPLOAD_URL_TTL)
                .putObjectRequest(putRequest)
                .build();

        var presigned = s3PresignerProvider.getObject().presignPutObject(presignRequest);

        return new PresignedUploadResponse(
                presigned.url().toString(),
                buildPublicUrl(key),
                key
        );
    }

    public void deleteFile(String key) {
        requireConfigured();
        var request = DeleteObjectRequest.builder()
                .bucket(properties.bucket())
                .key(key)
                .build();
        s3ClientProvider.getObject().deleteObject(request);
    }

    private void requireConfigured() {
        if (!properties.isConfigured()) {
            throw new StorageNotConfiguredException();
        }
    }

    private String extractExtension(String filename) {
        var dot = filename.lastIndexOf('.');
        if (dot < 0 || dot == filename.length() - 1) {
            throw new InvalidUploadException("Arquivo sem extensao: " + filename);
        }
        return filename.substring(dot + 1).toLowerCase();
    }

    private String buildKey(UUID userId, String extension) {
        return "listings/" + userId + "/"
                + Instant.now().toEpochMilli() + "-"
                + UUID.randomUUID() + "."
                + extension;
    }

    private String buildPublicUrl(String key) {
        var base = properties.publicUrl();
        if (base.endsWith("/")) {
            base = base.substring(0, base.length() - 1);
        }
        return base + "/" + key;
    }
}
