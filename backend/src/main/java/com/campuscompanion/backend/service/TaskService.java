package com.campuscompanion.backend.service;

import com.campuscompanion.backend.dto.TaskRequest;
import com.campuscompanion.backend.entity.Course;
import com.campuscompanion.backend.entity.Task;
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

    public TaskService(TaskRepository taskRepository, CourseRepository courseRepository) {
        this.taskRepository = taskRepository;
        this.courseRepository = courseRepository;
    }

    public List<Task> getAllTasks(Long courseId) {
        if (courseId != null) {
            return taskRepository.findByCourseId(courseId);
        }

        return taskRepository.findAll();
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Task not found"));
    }

    public Task createTask(TaskRequest request) {
        Course course = getCourseById(request.getCourseId());

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDeadline(request.getDeadline());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setCourse(course);

        return taskRepository.save(task);
    }

    public Task updateTask(Long id, TaskRequest request) {
        Task task = getTaskById(id);
        Course course = getCourseById(request.getCourseId());

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

    private Course getCourseById(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Course not found"));
    }
}