package com.campuscompanion.backend.entity;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String lecturer;
    private String room;
    private String day;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer sks;

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
}