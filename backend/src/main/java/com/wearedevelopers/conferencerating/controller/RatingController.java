package com.wearedevelopers.conferencerating.controller;

import com.wearedevelopers.conferencerating.dto.RatingRequest;
import com.wearedevelopers.conferencerating.dto.RatingResponse;
import com.wearedevelopers.conferencerating.dto.TalkRatingResponse;
import com.wearedevelopers.conferencerating.dto.TalkResponse;
import com.wearedevelopers.conferencerating.dto.UserRatingResponse;
import com.wearedevelopers.conferencerating.entity.Rating;
import com.wearedevelopers.conferencerating.entity.Talk;
import com.wearedevelopers.conferencerating.entity.User;
import com.wearedevelopers.conferencerating.mapper.RatingMapper;
import com.wearedevelopers.conferencerating.repository.RatingRepository;
import com.wearedevelopers.conferencerating.repository.TalkRepository;
import com.wearedevelopers.conferencerating.repository.UserRepository;
import com.wearedevelopers.conferencerating.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/ratings")
public class RatingController {
    
    @Autowired
    private RatingRepository ratingRepository;
    
    @Autowired
    private TalkRepository talkRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RatingMapper ratingMapper;
    
    @PostMapping
    public ResponseEntity<?> createOrUpdateRating(
            @Valid @RequestBody RatingRequest ratingRequest,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        if (userPrincipal == null) {
            return ResponseEntity.badRequest().body("User must be authenticated to rate talks");
        }
        
        User user = userRepository.findByUsername(userPrincipal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Optional<Talk> talkOpt = talkRepository.findById(ratingRequest.getTalkId());
        if (talkOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Talk not found");
        }
        
        Talk talk = talkOpt.get();
        
        // Check if user has already rated this talk
        Optional<Rating> existingRating = ratingRepository.findByUserAndTalk(user, talk);
        
        Rating rating;
        if (existingRating.isPresent()) {
            // Update existing rating
            rating = existingRating.get();
            rating.setRating(ratingRequest.getRating());
            rating.setComment(ratingRequest.getComment());
        } else {
            // Create new rating
            rating = new Rating(ratingRequest.getRating(), user, talk);
            rating.setComment(ratingRequest.getComment());
        }
        
        Rating savedRating = ratingRepository.save(rating);
        
        // Return updated talk response with new statistics
        TalkResponse talkResponse = convertToTalkResponse(talk, user);
        return ResponseEntity.ok(talkResponse);
    }
    
    @GetMapping("/user")
    public ResponseEntity<List<UserRatingResponse>> getUserRatings(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        if (userPrincipal == null) {
            return ResponseEntity.badRequest().build();
        }
        
        User user = userRepository.findByUsername(userPrincipal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Rating> userRatings = ratingRepository.findByUser(user);
        List<UserRatingResponse> response = ratingMapper.toUserRatingResponseList(userRatings);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/talk/{talkId}")
    public ResponseEntity<List<TalkRatingResponse>> getTalkRatings(@PathVariable Long talkId) {
        
        Optional<Talk> talkOpt = talkRepository.findById(talkId);
        if (talkOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        List<Rating> talkRatings = ratingRepository.findByTalk(talkOpt.get());
        List<TalkRatingResponse> response = ratingMapper.toTalkRatingResponseList(talkRatings);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{ratingId}")
    public ResponseEntity<?> deleteRating(
            @PathVariable Long ratingId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        if (userPrincipal == null) {
            return ResponseEntity.badRequest().body("User must be authenticated");
        }
        
        Optional<Rating> ratingOpt = ratingRepository.findById(ratingId);
        if (ratingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Rating rating = ratingOpt.get();
        User user = userRepository.findByUsername(userPrincipal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if the rating belongs to the current user
        if (!rating.getUser().getId().equals(user.getId())) {
            return ResponseEntity.badRequest().body("You can only delete your own ratings");
        }
        
        ratingRepository.delete(rating);
        return ResponseEntity.ok("Rating deleted successfully");
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
