package com.wearedevelopers.conferencerating.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wearedevelopers.conferencerating.dto.json.ConferenceData;
import com.wearedevelopers.conferencerating.dto.json.SessionData;
import com.wearedevelopers.conferencerating.dto.json.SpeakerData;
import com.wearedevelopers.conferencerating.entity.Talk;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JsonDataLoader {
    
    private final ObjectMapper objectMapper;
    
    public JsonDataLoader() {
        this.objectMapper = new ObjectMapper();
    }
    
    public List<Talk> loadTalksFromJson() throws IOException {
        ClassPathResource resource = new ClassPathResource("conference-data.json");
        ConferenceData conferenceData = objectMapper.readValue(resource.getInputStream(), ConferenceData.class);
        
        return conferenceData.getSessions().stream()
                .map(this::convertSessionToTalk)
                .collect(Collectors.toList());
    }
    
    private Talk convertSessionToTalk(SessionData session) {
        Talk talk = new Talk();
        
        // Basic fields
        talk.setTitle(session.getTitle() != null ? session.getTitle() : "");
        talk.setDescription(session.getDescription() != null ? session.getDescription() : "");
        
        // Convert speakers array to comma-separated string
        String speakerNames = "";
        if (session.getSpeakers() != null && !session.getSpeakers().isEmpty()) {
            speakerNames = session.getSpeakers().stream()
                    .map(SpeakerData::getFullName)
                    .filter(name -> name != null && !name.trim().isEmpty())
                    .collect(Collectors.joining(", "));
        }
        talk.setSpeaker(speakerNames.isEmpty() ? "TBD" : speakerNames);
        
        // Extract track and stage names
        talk.setTrack(session.getTrack() != null ? session.getTrack().getName() : "");
        talk.setRoom(session.getStage() != null ? session.getStage().getName() : "");
        
        // Recording URL
        talk.setRecordingUrl(session.getRecordingUrl());
        
        // Parse datetime strings
        if (session.getStartsAt() != null) {
            LocalDateTime startDateTime = parseDateTime(session.getStartsAt());
            talk.setDate(startDateTime.toLocalDate());
            talk.setStartTime(startDateTime.toLocalTime());
        }
        
        if (session.getEndsAt() != null) {
            LocalDateTime endDateTime = parseDateTime(session.getEndsAt());
            talk.setEndTime(endDateTime.toLocalTime());
        }
        
        return talk;
    }
    
    private LocalDateTime parseDateTime(String dateTimeString) {
        try {
            // Handle ISO 8601 format: "2025-07-10T08:10:00+00:00"
            DateTimeFormatter formatter = DateTimeFormatter.ISO_OFFSET_DATE_TIME;
            return LocalDateTime.parse(dateTimeString, formatter);
        } catch (Exception e) {
            // Fallback to current date/time if parsing fails
            System.err.println("Failed to parse datetime: " + dateTimeString + ", using current time");
            return LocalDateTime.now();
        }
    }
}
