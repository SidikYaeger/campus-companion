package com.campuscompanion.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalTime;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Course name is required")
    private String name;

    @NotBlank(message = "Lecturer name is required")
    private String lecturer;

    @NotBlank(message = "Room is required")
    private String room;

    @NotBlank(message = "Day is required")
    private String day;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @NotNull(message = "SKS is required")
    @Min(value = 1, message = "SKS must be at least 1")
    @Max(value = 6, message = "SKS must be at most 6")
    private Integer sks;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    public Course() {
    }

    public Course(Long id, String name, String lecturer, String room, String day,
                  LocalTime startTime, LocalTime endTime, Integer sks) {
        this.id = id;
        this.name = name;
        this.lecturer = lecturer;
        this.room = room;
        this.day = day;
        this.startTime = startTime;
        this.endTime = endTime;
        this.sks = sks;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getLecturer() {
        return lecturer;
    }

    public String getRoom() {
        return room;
    }

    public String getDay() {
        return day;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public Integer getSks() {
        return sks;
    }

    public User getOwner() {
        return owner;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setLecturer(String lecturer) {
        this.lecturer = lecturer;
    }

    public void setRoom(String room) {
        this.room = room;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public void setSks(Integer sks) {
        this.sks = sks;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }
}
