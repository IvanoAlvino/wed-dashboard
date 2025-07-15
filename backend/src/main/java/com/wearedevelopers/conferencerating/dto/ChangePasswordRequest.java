package com.wearedevelopers.conferencerating.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordRequest {
    
    @NotBlank
    private String currentPassword;
    
    @NotBlank
    @Size(min = 6, max = 100)
    private String newPassword;
    
    @NotBlank
    private String confirmPassword;
}
