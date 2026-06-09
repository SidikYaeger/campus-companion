package com.campuscompanion.backend.service;

import com.campuscompanion.backend.dto.DashboardSummary;
import com.campuscompanion.backend.entity.Task;
import com.campuscompanion.backend.repository.CourseRepository;
import com.campuscompanion.backend.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DashboardService {

    private final CourseRepository courseRepository;
    private final TaskRepository taskRepository;
    private final AuthService authService;

    public DashboardService(
            CourseRepository courseRepository,
            TaskRepository taskRepository,
            AuthService authService
    ) {
        this.courseRepository = courseRepository;
        this.taskRepository = taskRepository;
        this.authService = authService;
    }

    public DashboardSummary getDashboardSummary() {
        Long ownerId = authService.requireUser().getId();
        List<Task> allTasks = taskRepository.findByOwnerId(ownerId);

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime next24Hours = now.plusHours(24);

        long totalCourses = courseRepository.countByOwnerId(ownerId);
        long totalTasks = allTasks.size();

        long completedTasks = allTasks.stream()
                .filter(task -> "DONE".equals(task.getStatus()))
                .count();

        long highPriorityTasks = allTasks.stream()
                .filter(task -> "HIGH".equals(task.getPriority()))
                .count();

        long overdueTasks = allTasks.stream()
                .filter(task -> !"DONE".equals(task.getStatus()))
                .filter(task -> task.getDeadline() != null)
                .filter(task -> task.getDeadline().isBefore(now))
                .count();

        long dueSoonTasks = allTasks.stream()
                .filter(task -> !"DONE".equals(task.getStatus()))
                .filter(task -> task.getDeadline() != null)
                .filter(task -> !task.getDeadline().isBefore(now))
                .filter(task -> task.getDeadline().isBefore(next24Hours))
                .count();

        long pendingTasks = totalTasks - completedTasks;

        return new DashboardSummary(
                totalCourses,
                totalTasks,
                pendingTasks,
                completedTasks,
                highPriorityTasks,
                overdueTasks,
                dueSoonTasks
        );
    }

    public List<Task> getUpcomingTasks() {
        return taskRepository.findTop5ByOwnerIdAndStatusNotOrderByDeadlineAsc(
                authService.requireUser().getId(),
                "DONE"
        );
    }
}
