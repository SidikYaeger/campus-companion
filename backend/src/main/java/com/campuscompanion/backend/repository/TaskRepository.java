package com.campuscompanion.backend.repository;

import com.campuscompanion.backend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByOwnerId(Long ownerId);

    List<Task> findByCourseIdAndOwnerId(Long courseId, Long ownerId);

    Optional<Task> findByIdAndOwnerId(Long id, Long ownerId);

    List<Task> findTop5ByOwnerIdAndStatusNotOrderByDeadlineAsc(Long ownerId, String status);
}
