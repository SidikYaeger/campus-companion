package com.campuscompanion.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/")
    public String root() {
        return "Campus Companion API is running. Health check: /api/health";
    }

    @GetMapping("/api/health")
    public String healthCheck() {
        return "Campus Companion backend is running";
    }
}
