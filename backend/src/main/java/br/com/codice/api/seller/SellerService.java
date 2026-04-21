package br.com.codice.api.seller;

import br.com.codice.api.common.SlugService;
import br.com.codice.api.seller.dto.CreateSellerProfileRequest;
import br.com.codice.api.seller.dto.SellerProfileResponse;
import br.com.codice.api.user.ProfileType;
import br.com.codice.api.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class SellerService {

    private final SellerRepository sellerRepository;
    private final SlugService slugService;

    public SellerService(SellerRepository sellerRepository, SlugService slugService) {
        this.sellerRepository = sellerRepository;
        this.slugService = slugService;
    }

    @Transactional
    public SellerProfileResponse createProfile(User user, CreateSellerProfileRequest request) {
        if (user.getProfileType() == ProfileType.BUYER) {
            throw new BuyerCannotSellException();
        }

        if (sellerRepository.findByUserId(user.getId()).isPresent()) {
            throw new SellerProfileAlreadyExistsException();
        }

        SellerType sellerType = user.getProfileType() == ProfileType.BOOKSTORE
                ? SellerType.BOOKSTORE
                : SellerType.INDIVIDUAL;

        String slug = slugService.generateSellerSlug(request.publicName());

        var seller = new Seller(
                user,
                sellerType,
                request.publicName(),
                slug,
                request.description(),
                request.city(),
                request.state()
        );
        seller.setNeighborhood(request.neighborhood());

        seller = sellerRepository.save(seller);
        return SellerProfileResponse.fromSeller(seller);
    }

    @Transactional(readOnly = true)
    public Optional<SellerProfileResponse> getMyProfile(User user) {
        return sellerRepository.findByUserId(user.getId())
                .map(SellerProfileResponse::fromSeller);
    }
}
