package com.campuscompanion.backend.service;

import com.campuscompanion.backend.dto.CalendarEventRequest;
import com.campuscompanion.backend.entity.CalendarEvent;
import com.campuscompanion.backend.repository.CalendarEventRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class CalendarEventService {

    private final CalendarEventRepository calendarEventRepository;

    public CalendarEventService(CalendarEventRepository calendarEventRepository) {
        this.calendarEventRepository = calendarEventRepository;
    }

    public List<CalendarEvent> getAllEvents(LocalDateTime start, LocalDateTime end) {
        if (start != null && end != null) {
            return calendarEventRepository.findByStartDateTimeBetweenOrderByStartDateTimeAsc(start, end);
        }

        return calendarEventRepository.findAll();
    }

    public CalendarEvent getEventById(Long id) {
        return calendarEventRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Calendar event not found"));
    }

    public CalendarEvent createEvent(CalendarEventRequest request) {
        validateDateTime(request);

        CalendarEvent event = new CalendarEvent();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setStartDateTime(request.getStartDateTime());
        event.setEndDateTime(request.getEndDateTime());
        event.setType(request.getType());
        event.setReminderMinutesBefore(request.getReminderMinutesBefore());

        return calendarEventRepository.save(event);
    }

    public CalendarEvent updateEvent(Long id, CalendarEventRequest request) {
        validateDateTime(request);

        CalendarEvent event = getEventById(id);

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setStartDateTime(request.getStartDateTime());
        event.setEndDateTime(request.getEndDateTime());
        event.setType(request.getType());
        event.setReminderMinutesBefore(request.getReminderMinutesBefore());

        return calendarEventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        CalendarEvent event = getEventById(id);
        calendarEventRepository.delete(event);
    }

    private void validateDateTime(CalendarEventRequest request) {
        if (request.getEndDateTime().isBefore(request.getStartDateTime())) {
            throw new ResponseStatusException(BAD_REQUEST, "End time cannot be before start time");
        }
    }
}