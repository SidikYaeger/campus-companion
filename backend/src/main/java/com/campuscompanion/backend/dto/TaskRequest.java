package com.campuscompanion.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDateTime;

public class TaskRequest {

    @NotBlank(message = "Task title is required")
    private String title;

    private String description;

    private LocalDateTime deadline;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "NOT_STARTED|IN_PROGRESS|DONE", message = "Status must be NOT_STARTED, IN_PROGRESS, or DONE")
    private String status;

    @NotBlank(message = "Priority is required")
    @Pattern(regexp = "LOW|MEDIUM|HIGH", message = "Priority must be LOW, MEDIUM, or HIGH")
    private String priority;

    @NotNull(message = "Course ID is required")
    private Long courseId;

    public TaskRequest() {
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public String getStatus() {
        return status;
    }

    public String getPriority() {
        return priority;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }
}
