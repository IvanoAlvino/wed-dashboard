package com.wearedevelopers.conferencerating.controller;

import com.wearedevelopers.conferencerating.dto.RatingRequest;
import com.wearedevelopers.conferencerating.entity.Rating;
import com.wearedevelopers.conferencerating.entity.Talk;
import com.wearedevelopers.conferencerating.entity.User;
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
@RequestMapping("/ratings")
public class RatingController {
    
    @Autowired
    private RatingRepository ratingRepository;
    
    @Autowired
    private TalkRepository talkRepository;
    
    @Autowired
    private UserRepository userRepository;
    
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
        
        return ResponseEntity.ok(savedRating);
    }
    
    @GetMapping("/user")
    public ResponseEntity<List<Rating>> getUserRatings(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        if (userPrincipal == null) {
            return ResponseEntity.badRequest().build();
        }
        
        User user = userRepository.findByUsername(userPrincipal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Rating> userRatings = ratingRepository.findByUser(user);
        return ResponseEntity.ok(userRatings);
    }
    
    @GetMapping("/talk/{talkId}")
    public ResponseEntity<List<Rating>> getTalkRatings(@PathVariable Long talkId) {
        
        Optional<Talk> talkOpt = talkRepository.findById(talkId);
        if (talkOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        List<Rating> talkRatings = ratingRepository.findByTalk(talkOpt.get());
        return ResponseEntity.ok(talkRatings);
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
}
