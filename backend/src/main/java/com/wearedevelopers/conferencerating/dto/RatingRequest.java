package com.wearedevelopers.conferencerating.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class RatingRequest {
    
    @NotNull
    private Long talkId;
    
    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;
    
    private String comment;
    
    public RatingRequest() {}
    
    public RatingRequest(Long talkId, Integer rating, String comment) {
        this.talkId = talkId;
        this.rating = rating;
        this.comment = comment;
    }
    
    public Long getTalkId() {
        return talkId;
    }
    
    public void setTalkId(Long talkId) {
        this.talkId = talkId;
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
}
