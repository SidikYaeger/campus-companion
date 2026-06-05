package com.campuscompanion.backend.controller;

import com.campuscompanion.backend.dto.CalendarEventRequest;
import com.campuscompanion.backend.entity.CalendarEvent;
import com.campuscompanion.backend.service.CalendarEventService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/calendar-events")
public class CalendarEventController {

    private final CalendarEventService calendarEventService;

    public CalendarEventController(CalendarEventService calendarEventService) {
        this.calendarEventService = calendarEventService;
    }

    @GetMapping
    public List<CalendarEvent> getAllEvents(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime start,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime end
    ) {
        return calendarEventService.getAllEvents(start, end);
    }

    @GetMapping("/{id}")
    public CalendarEvent getEventById(@PathVariable Long id) {
        return calendarEventService.getEventById(id);
    }

    @PostMapping
    public CalendarEvent createEvent(@Valid @RequestBody CalendarEventRequest request) {
        return calendarEventService.createEvent(request);
    }

    @PutMapping("/{id}")
    public CalendarEvent updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody CalendarEventRequest request
    ) {
        return calendarEventService.updateEvent(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        calendarEventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}