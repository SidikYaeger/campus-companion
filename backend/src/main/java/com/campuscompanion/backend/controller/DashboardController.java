package com.campuscompanion.backend.controller;

import com.campuscompanion.backend.dto.DashboardSummary;
import com.campuscompanion.backend.entity.Task;
import com.campuscompanion.backend.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/api/dashboard/summary")
    public DashboardSummary getDashboardSummary() {
        return dashboardService.getDashboardSummary();
    }

    @GetMapping("/api/dashboard/upcoming-tasks")
    public List<Task> getUpcomingTasks() {
        return dashboardService.getUpcomingTasks();
    }
}