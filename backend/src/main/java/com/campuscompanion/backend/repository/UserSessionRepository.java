package com.campuscompanion.backend.repository;

import com.campuscompanion.backend.entity.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface UserSessionRepository extends JpaRepository<UserSession, Long> {

    Optional<UserSession> findByTokenAndExpiresAtAfter(String token, LocalDateTime now);

    void deleteByToken(String token);
}
