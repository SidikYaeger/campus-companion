package com.campuscompanion.backend.service;

import com.campuscompanion.backend.entity.Course;
import com.campuscompanion.backend.repository.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Course not found"));
    }

    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    public Course updateCourse(Long id, Course courseDetails) {
        Course course = getCourseById(id);

        course.setName(courseDetails.getName());
        course.setLecturer(courseDetails.getLecturer());
        course.setRoom(courseDetails.getRoom());
        course.setDay(courseDetails.getDay());
        course.setStartTime(courseDetails.getStartTime());
        course.setEndTime(courseDetails.getEndTime());
        course.setSks(courseDetails.getSks());

        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {
        Course course = getCourseById(id);
        courseRepository.delete(course);
    }
}