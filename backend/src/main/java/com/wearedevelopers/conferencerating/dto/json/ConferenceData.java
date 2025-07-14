package com.wearedevelopers.conferencerating.dto.json;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ConferenceData {
    
    private List<SessionData> sessions;
    
    // Constructors
    public ConferenceData() {}
    
    // Getters and Setters
    public List<SessionData> getSessions() {
        return sessions;
    }
    
    public void setSessions(List<SessionData> sessions) {
        this.sessions = sessions;
    }
}
