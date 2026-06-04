package com.campuscompanion.backend.controller;

import com.campuscompanion.backend.dto.DashboardSummary;
import com.campuscompanion.backend.entity.Task;
import com.campuscompanion.backend.repository.CourseRepository;
import com.campuscompanion.backend.repository.TaskRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class DashboardController {

    private final CourseRepository courseRepository;
    private final TaskRepository taskRepository;

    public DashboardController(CourseRepository courseRepository, TaskRepository taskRepository) {
        this.courseRepository = courseRepository;
        this.taskRepository = taskRepository;
    }

    @GetMapping("/api/dashboard/summary")
    public DashboardSummary getDashboardSummary() {
        long totalCourses = courseRepository.count();
        long totalTasks = taskRepository.count();
        long completedTasks = taskRepository.countByStatus("DONE");
        long highPriorityTasks = taskRepository.countByPriority("HIGH");

        long pendingTasks = totalTasks - completedTasks;

        return new DashboardSummary(
                totalCourses,
                totalTasks,
                pendingTasks,
                completedTasks,
                highPriorityTasks
        );
    }

    @GetMapping("/api/dashboard/upcoming-tasks")
    public List<Task> getUpcomingTasks() {
        return taskRepository.findTop5ByStatusNotOrderByDeadlineAsc("DONE");
    }
}