package br.com.codice.api.admin;

import br.com.codice.api.admin.dto.BootstrapRequest;
import br.com.codice.api.admin.dto.BootstrapResponse;
import br.com.codice.api.auth.dto.UserResponse;
import br.com.codice.api.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;

@RestController
@RequestMapping("/admin")
public class AdminBootstrapController {

    private final UserRepository userRepository;

    public AdminBootstrapController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/bootstrap")
    public ResponseEntity<BootstrapResponse> bootstrap(@Valid @RequestBody BootstrapRequest request) {
        var user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UserNotFoundException(request.email()));

        user.setAdmin(true);
        user.setUpdatedAt(OffsetDateTime.now());
        userRepository.save(user);

        return ResponseEntity.ok(new BootstrapResponse(
                UserResponse.fromUser(user),
                "Admin promovido com sucesso. O usuario precisa fazer login novamente para obter um token atualizado."
        ));
    }
}
