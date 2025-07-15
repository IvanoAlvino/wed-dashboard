package com.wearedevelopers.conferencerating.controller;

import com.wearedevelopers.conferencerating.dto.TalkResponse;
import com.wearedevelopers.conferencerating.entity.Rating;
import com.wearedevelopers.conferencerating.entity.Talk;
import com.wearedevelopers.conferencerating.entity.User;
import com.wearedevelopers.conferencerating.repository.RatingRepository;
import com.wearedevelopers.conferencerating.repository.TalkRepository;
import com.wearedevelopers.conferencerating.repository.UserRepository;
import com.wearedevelopers.conferencerating.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/talks")
public class TalkController {
    
    @Autowired
    private TalkRepository talkRepository;
    
    @Autowired
    private RatingRepository ratingRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping
    public ResponseEntity<Map<String, List<TalkResponse>>> getAllTalksGroupedByDate(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        List<Talk> talks = talkRepository.findAllOrderByDateAndTime();
        User currentUser = null;
        
        if (userPrincipal != null) {
            currentUser = userRepository.findByUsername(userPrincipal.getUsername()).orElse(null);
        }
        
        final User finalCurrentUser = currentUser;
        Map<String, List<TalkResponse>> groupedTalks = new LinkedHashMap<>();
        
        for (Talk talk : talks) {
            String dateKey = talk.getDate().toString();
            TalkResponse talkResponse = convertToTalkResponse(talk, finalCurrentUser);
            
            groupedTalks.computeIfAbsent(dateKey, k -> new java.util.ArrayList<>()).add(talkResponse);
        }
        
        return ResponseEntity.ok(groupedTalks);
    }
    
    @GetMapping("/date/{date}")
    public ResponseEntity<List<TalkResponse>> getTalksByDate(
            @PathVariable String date,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        LocalDate localDate = LocalDate.parse(date);
        List<Talk> talks = talkRepository.findByDateOrderByStartTimeAsc(localDate);
        User currentUser = null;
        
        if (userPrincipal != null) {
            currentUser = userRepository.findByUsername(userPrincipal.getUsername()).orElse(null);
        }
        
        final User finalCurrentUser = currentUser;
        List<TalkResponse> talkResponses = talks.stream()
                .map(talk -> convertToTalkResponse(talk, finalCurrentUser))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(talkResponses);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TalkResponse> getTalkById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        Optional<Talk> talkOpt = talkRepository.findById(id);
        if (talkOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User currentUser = null;
        if (userPrincipal != null) {
            currentUser = userRepository.findByUsername(userPrincipal.getUsername()).orElse(null);
        }
        
        TalkResponse talkResponse = convertToTalkResponse(talkOpt.get(), currentUser);
        return ResponseEntity.ok(talkResponse);
    }
    
    @GetMapping("/popular")
    public ResponseEntity<List<TalkResponse>> getPopularTalks(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        List<Talk> talks = talkRepository.findTalksWithRatingsOrderByPopularity();
        User currentUser = null;
        
        if (userPrincipal != null) {
            currentUser = userRepository.findByUsername(userPrincipal.getUsername()).orElse(null);
        }
        
        final User finalCurrentUser = currentUser;
        List<TalkResponse> talkResponses = talks.stream()
                .map(talk -> convertToTalkResponse(talk, finalCurrentUser))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(talkResponses);
    }
    
    private TalkResponse convertToTalkResponse(Talk talk, User currentUser) {
        TalkResponse response = new TalkResponse();
        response.setId(talk.getId());
        response.setTitle(talk.getTitle());
        response.setSpeaker(talk.getSpeaker());
        response.setDate(talk.getDate());
        response.setStartTime(talk.getStartTime());
        response.setEndTime(talk.getEndTime());
        response.setDescription(talk.getDescription());
        response.setTrack(talk.getTrack());
        response.setRoom(talk.getRoom());
        response.setRecordingUrl(talk.getRecordingUrl());
        
        // Add rating statistics
        Double avgRating = ratingRepository.findAverageRatingByTalk(talk);
        Long ratingCount = ratingRepository.countRatingsByTalk(talk);
        
        response.setAverageRating(avgRating);
        response.setRatingCount(ratingCount);
        
        // Add current user's rating if authenticated
        if (currentUser != null) {
            Optional<Rating> userRating = ratingRepository.findByUserAndTalk(currentUser, talk);
            if (userRating.isPresent()) {
                response.setUserRating(userRating.get().getRating());
            }
        }
        
        return response;
    }
}
