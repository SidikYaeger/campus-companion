package com.campuscompanion.backend.repository;

import com.campuscompanion.backend.entity.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {

    List<CalendarEvent> findByOwnerId(Long ownerId);

    Optional<CalendarEvent> findByIdAndOwnerId(Long id, Long ownerId);

    List<CalendarEvent> findByOwnerIdAndStartDateTimeBetweenOrderByStartDateTimeAsc(
            Long ownerId,
            LocalDateTime start,
            LocalDateTime end
    );
}
