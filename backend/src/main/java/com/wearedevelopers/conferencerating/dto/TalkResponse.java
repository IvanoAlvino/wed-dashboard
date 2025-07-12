package com.wearedevelopers.conferencerating.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class TalkResponse {
    
    private Long id;
    private String title;
    private String speaker;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String description;
    private String track;
    private String room;
    private Double averageRating;
    private Long ratingCount;
    private Integer userRating;
    
    public TalkResponse() {}
    
    public TalkResponse(Long id, String title, String speaker, LocalDate date, LocalTime startTime) {
        this.id = id;
        this.title = title;
        this.speaker = speaker;
        this.date = date;
        this.startTime = startTime;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getSpeaker() {
        return speaker;
    }
    
    public void setSpeaker(String speaker) {
        this.speaker = speaker;
    }
    
    public LocalDate getDate() {
        return date;
    }
    
    public void setDate(LocalDate date) {
        this.date = date;
    }
    
    public LocalTime getStartTime() {
        return startTime;
    }
    
    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }
    
    public LocalTime getEndTime() {
        return endTime;
    }
    
    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getTrack() {
        return track;
    }
    
    public void setTrack(String track) {
        this.track = track;
    }
    
    public String getRoom() {
        return room;
    }
    
    public void setRoom(String room) {
        this.room = room;
    }
    
    public Double getAverageRating() {
        return averageRating;
    }
    
    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }
    
    public Long getRatingCount() {
        return ratingCount;
    }
    
    public void setRatingCount(Long ratingCount) {
        this.ratingCount = ratingCount;
    }
    
    public Integer getUserRating() {
        return userRating;
    }
    
    public void setUserRating(Integer userRating) {
        this.userRating = userRating;
    }
}
