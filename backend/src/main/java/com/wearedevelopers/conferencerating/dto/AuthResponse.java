package com.wearedevelopers.conferencerating.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private boolean mustChangePassword;
    
    public AuthResponse(String token, Long id, String username, String email, boolean mustChangePassword) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.mustChangePassword = mustChangePassword;
    }
}
