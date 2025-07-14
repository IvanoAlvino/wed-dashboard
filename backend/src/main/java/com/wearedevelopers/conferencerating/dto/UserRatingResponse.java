package com.wearedevelopers.conferencerating.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class UserRatingResponse {
    
    private Long id;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Talk information for user context
    private Long talkId;
    private String talkTitle;
    private String talkSpeaker;
    private LocalDate talkDate;
    private LocalTime talkStartTime;
    private LocalTime talkEndTime;
    private String talkTrack;
    private String talkRoom;
    
    public UserRatingResponse() {}
    
    public UserRatingResponse(Long id, Integer rating, String comment, LocalDateTime createdAt,
                             LocalDateTime updatedAt, Long talkId, String talkTitle, String talkSpeaker,
                             LocalDate talkDate, LocalTime talkStartTime, LocalTime talkEndTime,
                             String talkTrack, String talkRoom) {
        this.id = id;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.talkId = talkId;
        this.talkTitle = talkTitle;
        this.talkSpeaker = talkSpeaker;
        this.talkDate = talkDate;
        this.talkStartTime = talkStartTime;
        this.talkEndTime = talkEndTime;
        this.talkTrack = talkTrack;
        this.talkRoom = talkRoom;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Integer getRating() {
        return rating;
    }
    
    public void setRating(Integer rating) {
        this.rating = rating;
    }
    
    public String getComment() {
        return comment;
    }
    
    public void setComment(String comment) {
        this.comment = comment;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public Long getTalkId() {
        return talkId;
    }
    
    public void setTalkId(Long talkId) {
        this.talkId = talkId;
    }
    
    public String getTalkTitle() {
        return talkTitle;
    }
    
    public void setTalkTitle(String talkTitle) {
        this.talkTitle = talkTitle;
    }
    
    public String getTalkSpeaker() {
        return talkSpeaker;
    }
    
    public void setTalkSpeaker(String talkSpeaker) {
        this.talkSpeaker = talkSpeaker;
    }
    
    public LocalDate getTalkDate() {
        return talkDate;
    }
    
    public void setTalkDate(LocalDate talkDate) {
        this.talkDate = talkDate;
    }
    
    public LocalTime getTalkStartTime() {
        return talkStartTime;
    }
    
    public void setTalkStartTime(LocalTime talkStartTime) {
        this.talkStartTime = talkStartTime;
    }
    
    public LocalTime getTalkEndTime() {
        return talkEndTime;
    }
    
    public void setTalkEndTime(LocalTime talkEndTime) {
        this.talkEndTime = talkEndTime;
    }
    
    public String getTalkTrack() {
        return talkTrack;
    }
    
    public void setTalkTrack(String talkTrack) {
        this.talkTrack = talkTrack;
    }
    
    public String getTalkRoom() {
        return talkRoom;
    }
    
    public void setTalkRoom(String talkRoom) {
        this.talkRoom = talkRoom;
    }
}
