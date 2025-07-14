package com.wearedevelopers.conferencerating.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "talks")
public class Talk {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 200)
    private String title;
    
    @NotBlank
    @Size(max = 100)
    private String speaker;
    
    @NotNull
    @Column(name = "talk_date")
    private LocalDate date;
    
    @NotNull
    @Column(name = "start_time")
    private LocalTime startTime;
    
    @Column(name = "end_time")
    private LocalTime endTime;
    
    @Column(length = 5000)
    private String description;
    
    @Size(max = 100)
    private String track;
    
    @Size(max = 100)
    private String room;
    
    @Size(max = 500)
    private String recordingUrl;
    
    @OneToMany(mappedBy = "talk", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Rating> ratings = new HashSet<>();
    
    public Talk() {}
    
    public Talk(String title, String speaker, LocalDate date, LocalTime startTime) {
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
    
    public String getRecordingUrl() {
        return recordingUrl;
    }
    
    public void setRecordingUrl(String recordingUrl) {
        this.recordingUrl = recordingUrl;
    }
    
    public Set<Rating> getRatings() {
        return ratings;
    }
    
    public void setRatings(Set<Rating> ratings) {
        this.ratings = ratings;
    }
}
