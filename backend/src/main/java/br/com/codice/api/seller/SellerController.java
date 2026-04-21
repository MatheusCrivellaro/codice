package br.com.codice.api.seller;

import br.com.codice.api.seller.dto.CreateSellerProfileRequest;
import br.com.codice.api.seller.dto.SellerProfileResponse;
import br.com.codice.api.user.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/sellers")
public class SellerController {

    private final SellerService sellerService;
    private final SellerRepository sellerRepository;

    public SellerController(SellerService sellerService, SellerRepository sellerRepository) {
        this.sellerService = sellerService;
        this.sellerRepository = sellerRepository;
    }

    @PostMapping("/profile")
    public ResponseEntity<SellerProfileResponse> createProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateSellerProfileRequest request) {
        var response = sellerService.createProfile(user, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<SellerProfileResponse> getMyProfile(@AuthenticationPrincipal User user) {
        return sellerService.getMyProfile(user)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/active-states")
    public List<String> activeStates() {
        return sellerRepository.findDistinctStatesWithActiveListings();
    }
}
