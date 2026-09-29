package com.campuscare.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class AnalyticsDTO {

    private List<Map<String, Object>> categoryDistribution = new ArrayList<>();
    private List<Map<String, Object>> priorityDistribution = new ArrayList<>();
    private List<Map<String, Object>> statusDistribution = new ArrayList<>();
    private List<Map<String, Object>> staffWorkload = new ArrayList<>();
    private List<Map<String, Object>> trendData = new ArrayList<>();
    private double resolutionRate;
    private double averageResolutionHours;

    public AnalyticsDTO() {
    }

    public List<Map<String, Object>> getCategoryDistribution() {
        return categoryDistribution;
    }

    public void setCategoryDistribution(List<Map<String, Object>> categoryDistribution) {
        this.categoryDistribution = categoryDistribution;
    }

    public List<Map<String, Object>> getPriorityDistribution() {
        return priorityDistribution;
    }

    public void setPriorityDistribution(List<Map<String, Object>> priorityDistribution) {
        this.priorityDistribution = priorityDistribution;
    }

    public List<Map<String, Object>> getStatusDistribution() {
        return statusDistribution;
    }

    public void setStatusDistribution(List<Map<String, Object>> statusDistribution) {
        this.statusDistribution = statusDistribution;
    }

    public List<Map<String, Object>> getStaffWorkload() {
        return staffWorkload;
    }

    public void setStaffWorkload(List<Map<String, Object>> staffWorkload) {
        this.staffWorkload = staffWorkload;
    }

    public List<Map<String, Object>> getTrendData() {
        return trendData;
    }

    public void setTrendData(List<Map<String, Object>> trendData) {
        this.trendData = trendData;
    }

    public double getResolutionRate() {
        return resolutionRate;
    }

    public void setResolutionRate(double resolutionRate) {
        this.resolutionRate = resolutionRate;
    }

    public double getAverageResolutionHours() {
        return averageResolutionHours;
    }

    public void setAverageResolutionHours(double averageResolutionHours) {
        this.averageResolutionHours = averageResolutionHours;
    }
}
