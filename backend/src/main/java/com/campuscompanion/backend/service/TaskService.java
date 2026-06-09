package com.campuscompanion.backend.service;

import com.campuscompanion.backend.dto.TaskRequest;
import com.campuscompanion.backend.entity.Course;
import com.campuscompanion.backend.entity.Task;
import com.campuscompanion.backend.entity.User;
import com.campuscompanion.backend.repository.CourseRepository;
import com.campuscompanion.backend.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final CourseRepository courseRepository;
    private final AuthService authService;

    public TaskService(TaskRepository taskRepository, CourseRepository courseRepository, AuthService authService) {
        this.taskRepository = taskRepository;
        this.courseRepository = courseRepository;
        this.authService = authService;
    }

    public List<Task> getAllTasks(Long courseId) {
        Long ownerId = authService.requireUser().getId();

        if (courseId != null) {
            return taskRepository.findByCourseIdAndOwnerId(courseId, ownerId);
        }

        return taskRepository.findByOwnerId(ownerId);
    }

    public Task getTaskById(Long id) {
        return taskRepository.findByIdAndOwnerId(id, authService.requireUser().getId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Task not found"));
    }

    public Task createTask(TaskRequest request) {
        User owner = authService.requireUser();
        Course course = getCourseById(request.getCourseId(), owner.getId());

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDeadline(request.getDeadline());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setCourse(course);
        task.setOwner(owner);

        return taskRepository.save(task);
    }

    public Task updateTask(Long id, TaskRequest request) {
        Task task = getTaskById(id);
        Course course = getCourseById(request.getCourseId(), authService.requireUser().getId());

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDeadline(request.getDeadline());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setCourse(course);

        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        Task task = getTaskById(id);
        taskRepository.delete(task);
    }

    private Course getCourseById(Long courseId, Long ownerId) {
        return courseRepository.findByIdAndOwnerId(courseId, ownerId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Course not found"));
    }
}
