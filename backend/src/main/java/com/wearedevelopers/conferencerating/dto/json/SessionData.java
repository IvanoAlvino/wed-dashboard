package com.wearedevelopers.conferencerating.dto.json;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SessionData {
    
    private Long id;
    private String title;
    private String description;
    
    @JsonProperty("starts_at")
    private String startsAt;
    
    @JsonProperty("ends_at")
    private String endsAt;
    
    @JsonProperty("recording_url")
    private String recordingUrl;
    
    private Integer status;
    private Integer featured;
    
    private TrackData track;
    private StageData stage;
    private List<SpeakerData> speakers;
    
    // Constructors
    public SessionData() {}
    
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
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getStartsAt() {
        return startsAt;
    }
    
    public void setStartsAt(String startsAt) {
        this.startsAt = startsAt;
    }
    
    public String getEndsAt() {
        return endsAt;
    }
    
    public void setEndsAt(String endsAt) {
        this.endsAt = endsAt;
    }
    
    public String getRecordingUrl() {
        return recordingUrl;
    }
    
    public void setRecordingUrl(String recordingUrl) {
        this.recordingUrl = recordingUrl;
    }
    
    public Integer getStatus() {
        return status;
    }
    
    public void setStatus(Integer status) {
        this.status = status;
    }
    
    public Integer getFeatured() {
        return featured;
    }
    
    public void setFeatured(Integer featured) {
        this.featured = featured;
    }
    
    public TrackData getTrack() {
        return track;
    }
    
    public void setTrack(TrackData track) {
        this.track = track;
    }
    
    public StageData getStage() {
        return stage;
    }
    
    public void setStage(StageData stage) {
        this.stage = stage;
    }
    
    public List<SpeakerData> getSpeakers() {
        return speakers;
    }
    
    public void setSpeakers(List<SpeakerData> speakers) {
        this.speakers = speakers;
    }
}
