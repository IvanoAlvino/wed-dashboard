package com.wearedevelopers.conferencerating.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RatingResponse {
    
    private Long id;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // User information
    private Long userId;
    private String username;
    
    // Talk information
    private Long talkId;
    private String talkTitle;
    private String talkSpeaker;
}
