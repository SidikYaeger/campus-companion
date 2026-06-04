package com.campuscompanion.backend.controller;

import com.campuscompanion.backend.dto.TaskRequest;
import com.campuscompanion.backend.entity.Course;
import com.campuscompanion.backend.entity.Task;
import com.campuscompanion.backend.repository.CourseRepository;
import com.campuscompanion.backend.repository.TaskRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskRepository taskRepository;
    private final CourseRepository courseRepository;

    public TaskController(TaskRepository taskRepository, CourseRepository courseRepository) {
        this.taskRepository = taskRepository;
        this.courseRepository = courseRepository;
    }

    @GetMapping
    public List<Task> getAllTasks(@RequestParam(required = false) Long courseId) {
        if (courseId != null) {
            return taskRepository.findByCourseId(courseId);
        }

        return taskRepository.findAll();
    }

    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Task not found"));
    }

    @PostMapping
    public Task createTask(@RequestBody TaskRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Course not found"));

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDeadline(request.getDeadline());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setCourse(course);

        return taskRepository.save(task);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Task not found"));

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Course not found"));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDeadline(request.getDeadline());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setCourse(course);

        return taskRepository.save(task);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Task not found"));

        taskRepository.delete(task);

        return ResponseEntity.noContent().build();
    }
}