package com.wearedevelopers.conferencerating.dto.json;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SpeakerData {
    
    private Long id;
    
    @JsonProperty("full_name")
    private String fullName;
    
    private String bio;
    private String tagline;
    
    @JsonProperty("link_twitter")
    private String linkTwitter;
    
    @JsonProperty("link_linkedin")
    private String linkLinkedin;
    
    @JsonProperty("link_github")
    private String linkGithub;
    
    @JsonProperty("image_url")
    private String imageUrl;
    
    // Constructors
    public SpeakerData() {}
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public String getBio() {
        return bio;
    }
    
    public void setBio(String bio) {
        this.bio = bio;
    }
    
    public String getTagline() {
        return tagline;
    }
    
    public void setTagline(String tagline) {
        this.tagline = tagline;
    }
    
    public String getLinkTwitter() {
        return linkTwitter;
    }
    
    public void setLinkTwitter(String linkTwitter) {
        this.linkTwitter = linkTwitter;
    }
    
    public String getLinkLinkedin() {
        return linkLinkedin;
    }
    
    public void setLinkLinkedin(String linkLinkedin) {
        this.linkLinkedin = linkLinkedin;
    }
    
    public String getLinkGithub() {
        return linkGithub;
    }
    
    public void setLinkGithub(String linkGithub) {
        this.linkGithub = linkGithub;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
