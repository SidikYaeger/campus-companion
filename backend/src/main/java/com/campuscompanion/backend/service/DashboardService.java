package com.campuscompanion.backend.service;

import com.campuscompanion.backend.dto.DashboardSummary;
import com.campuscompanion.backend.entity.Task;
import com.campuscompanion.backend.repository.CourseRepository;
import com.campuscompanion.backend.repository.TaskRepository;
import org.springframework.stereotype.Service;

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

    public List<Task> getUpcomingTasks() {
        return taskRepository.findTop5ByStatusNotOrderByDeadlineAsc("DONE");
    }
}