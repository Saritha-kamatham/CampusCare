package com.campuscare.entity;

public enum IssueCategory {
    WIFI_INTERNET("Wi-Fi / Internet"),
    ELECTRICAL("Electrical"),
    CLASSROOM("Classroom"),
    LABORATORY("Laboratory"),
    HOSTEL("Hostel"),
    CLEANING("Cleaning"),
    LIBRARY("Library"),
    TRANSPORT("Transport"),
    SECURITY("Security"),
    OTHER("Other");

    private final String displayName;

    IssueCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
