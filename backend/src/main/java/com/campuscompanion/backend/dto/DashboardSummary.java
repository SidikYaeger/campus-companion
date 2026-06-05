package com.campuscompanion.backend.dto;

public class DashboardSummary {

    private long totalCourses;
    private long totalTasks;
    private long pendingTasks;
    private long completedTasks;
    private long highPriorityTasks;
    private long overdueTasks;
    private long dueSoonTasks;

    public DashboardSummary() {
    }

    public DashboardSummary(long totalCourses, long totalTasks, long pendingTasks,
                            long completedTasks, long highPriorityTasks,
                            long overdueTasks, long dueSoonTasks) {
        this.totalCourses = totalCourses;
        this.totalTasks = totalTasks;
        this.pendingTasks = pendingTasks;
        this.completedTasks = completedTasks;
        this.highPriorityTasks = highPriorityTasks;
        this.overdueTasks = overdueTasks;
        this.dueSoonTasks = dueSoonTasks;
    }

    public long getTotalCourses() {
        return totalCourses;
    }

    public void setTotalCourses(long totalCourses) {
        this.totalCourses = totalCourses;
    }

    public long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public long getPendingTasks() {
        return pendingTasks;
    }

    public void setPendingTasks(long pendingTasks) {
        this.pendingTasks = pendingTasks;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public long getHighPriorityTasks() {
        return highPriorityTasks;
    }

    public void setHighPriorityTasks(long highPriorityTasks) {
        this.highPriorityTasks = highPriorityTasks;
    }

    public long getOverdueTasks() {
        return overdueTasks;
    }

    public void setOverdueTasks(long overdueTasks) {
        this.overdueTasks = overdueTasks;
    }

    public long getDueSoonTasks() {
        return dueSoonTasks;
    }

    public void setDueSoonTasks(long dueSoonTasks) {
        this.dueSoonTasks = dueSoonTasks;
    }
}