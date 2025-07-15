package com.wearedevelopers.conferencerating.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "talks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Talk {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
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
    
    public Talk(String title, String speaker, LocalDate date, LocalTime startTime) {
        this.title = title;
        this.speaker = speaker;
        this.date = date;
        this.startTime = startTime;
    }
}
