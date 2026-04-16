package br.com.codice.api.auth;

import br.com.codice.api.auth.dto.AuthResponse;
import br.com.codice.api.auth.dto.LoginRequest;
import br.com.codice.api.auth.dto.RegisterRequest;
import br.com.codice.api.auth.dto.UserResponse;
import br.com.codice.api.auth.jwt.JwtService;
import br.com.codice.api.user.User;
import br.com.codice.api.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyInUseException(request.email());
        }

        var user = new User(
                request.email(),
                passwordEncoder.encode(request.password()),
                request.name(),
                request.profileType(),
                OffsetDateTime.now()
        );

        user = userRepository.save(user);

        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        var user = userRepository.findByEmail(request.email())
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }

        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        String token = jwtService.generateToken(user);
        return new AuthResponse(
                token,
                "Bearer",
                jwtService.getExpirationSeconds(),
                UserResponse.fromUser(user)
        );
    }
}
