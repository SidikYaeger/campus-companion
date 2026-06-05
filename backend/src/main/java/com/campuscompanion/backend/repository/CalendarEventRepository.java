package com.campuscompanion.backend.repository;

import com.campuscompanion.backend.entity.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {

    List<CalendarEvent> findByStartDateTimeBetweenOrderByStartDateTimeAsc(
            LocalDateTime start,
            LocalDateTime end
    );
}