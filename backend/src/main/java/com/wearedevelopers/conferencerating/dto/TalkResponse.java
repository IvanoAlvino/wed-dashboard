package com.wearedevelopers.conferencerating.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
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
    private String recordingUrl;
    private Double averageRating;
    private Long ratingCount;
    private Integer userRating;
    
    public TalkResponse(Long id, String title, String speaker, LocalDate date, LocalTime startTime) {
        this.id = id;
        this.title = title;
        this.speaker = speaker;
        this.date = date;
        this.startTime = startTime;
    }
}
