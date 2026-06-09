package com.campuscompanion.backend.service;

import com.campuscompanion.backend.dto.AuthResponse;
import com.campuscompanion.backend.dto.LoginRequest;
import com.campuscompanion.backend.dto.RegisterRequest;
import com.campuscompanion.backend.entity.User;
import com.campuscompanion.backend.entity.UserSession;
import com.campuscompanion.backend.repository.UserRepository;
import com.campuscompanion.backend.repository.UserSessionRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UserSessionRepository sessionRepository;
    private final HttpServletRequest request;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(
            UserRepository userRepository,
            UserSessionRepository sessionRepository,
            HttpServletRequest request
    ) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.request = request;
    }

    public AuthResponse register(RegisterRequest registerRequest) {
        String email = registerRequest.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(CONFLICT, "An account with this email already exists");
        }

        User user = new User();
        user.setName(registerRequest.getName().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));

        return createSession(userRepository.save(user));
    }

    public AuthResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByEmailIgnoreCase(loginRequest.getEmail().trim())
                .orElseThrow(() -> new ResponseStatusException(UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(UNAUTHORIZED, "Invalid email or password");
        }

        return createSession(user);
    }

    public AuthResponse me() {
        return new AuthResponse(null, requireUser());
    }

    @Transactional
    public void logout() {
        sessionRepository.deleteByToken(requireToken());
    }

    public User requireUser() {
        String token = requireToken();

        return sessionRepository.findByTokenAndExpiresAtAfter(token, LocalDateTime.now())
                .map(UserSession::getUser)
                .orElseThrow(() -> new ResponseStatusException(UNAUTHORIZED, "Session expired or invalid"));
    }

    private AuthResponse createSession(User user) {
        UserSession session = new UserSession();
        session.setToken(UUID.randomUUID().toString().replace("-", ""));
        session.setExpiresAt(LocalDateTime.now().plusDays(30));
        session.setUser(user);

        sessionRepository.save(session);
        return new AuthResponse(session.getToken(), user);
    }

    private String requireToken() {
        String authorization = request.getHeader("Authorization");

        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new ResponseStatusException(UNAUTHORIZED, "Authentication required");
        }

        String token = authorization.substring(7).trim();

        if (token.isEmpty()) {
            throw new ResponseStatusException(UNAUTHORIZED, "Authentication required");
        }

        return token;
    }
}
