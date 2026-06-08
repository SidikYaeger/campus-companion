package com.campuscompanion.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDateTime;

public class CalendarEventRequest {

    @NotBlank(message = "Event title is required")
    private String title;

    private String description;

    @NotNull(message = "Start date time is required")
    private LocalDateTime startDateTime;

    @NotNull(message = "End date time is required")
    private LocalDateTime endDateTime;

    @NotBlank(message = "Event type is required")
    @Pattern(regexp = "PERSONAL|ACADEMIC|ORGANIZATION", message = "Event type must be PERSONAL, ACADEMIC, or ORGANIZATION")
    private String type;

    @NotNull(message = "Reminder time is required")
    @Min(value = 0, message = "Reminder time cannot be negative")
    @Max(value = 10080, message = "Reminder time cannot be more than 7 days")
    private Integer reminderMinutesBefore;

    public CalendarEventRequest() {
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public LocalDateTime getStartDateTime() {
        return startDateTime;
    }

    public LocalDateTime getEndDateTime() {
        return endDateTime;
    }

    public String getType() {
        return type;
    }

    public Integer getReminderMinutesBefore() {
        return reminderMinutesBefore;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setStartDateTime(LocalDateTime startDateTime) {
        this.startDateTime = startDateTime;
    }

    public void setEndDateTime(LocalDateTime endDateTime) {
        this.endDateTime = endDateTime;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setReminderMinutesBefore(Integer reminderMinutesBefore) {
        this.reminderMinutesBefore = reminderMinutesBefore;
    }
}
