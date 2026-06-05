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

    public DashboardService(CourseRepository courseRepository, TaskRepository taskRepository) {
        this.courseRepository = courseRepository;
        this.taskRepository = taskRepository;
    }

    public DashboardSummary getDashboardSummary() {
        List<Task> allTasks = taskRepository.findAll();

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime next24Hours = now.plusHours(24);

        long totalCourses = courseRepository.count();
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
        return taskRepository.findTop5ByStatusNotOrderByDeadlineAsc("DONE");
    }
}