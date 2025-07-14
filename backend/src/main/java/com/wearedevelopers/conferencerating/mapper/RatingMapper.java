package com.wearedevelopers.conferencerating.mapper;

import com.wearedevelopers.conferencerating.dto.RatingResponse;
import com.wearedevelopers.conferencerating.dto.TalkRatingResponse;
import com.wearedevelopers.conferencerating.dto.UserRatingResponse;
import com.wearedevelopers.conferencerating.entity.Rating;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class RatingMapper {
    
    /**
     * Convert Rating entity to RatingResponse DTO
     */
    public RatingResponse toRatingResponse(Rating rating) {
        if (rating == null) {
            return null;
        }
        
        return new RatingResponse(
            rating.getId(),
            rating.getRating(),
            rating.getComment(),
            rating.getCreatedAt(),
            rating.getUpdatedAt(),
            rating.getUser().getId(),
            rating.getUser().getUsername(),
            rating.getTalk().getId(),
            rating.getTalk().getTitle(),
            rating.getTalk().getSpeaker()
        );
    }
    
    /**
     * Convert Rating entity to UserRatingResponse DTO (for user-specific queries)
     */
    public UserRatingResponse toUserRatingResponse(Rating rating) {
        if (rating == null) {
            return null;
        }
        
        return new UserRatingResponse(
            rating.getId(),
            rating.getRating(),
            rating.getComment(),
            rating.getCreatedAt(),
            rating.getUpdatedAt(),
            rating.getTalk().getId(),
            rating.getTalk().getTitle(),
            rating.getTalk().getSpeaker(),
            rating.getTalk().getDate(),
            rating.getTalk().getStartTime(),
            rating.getTalk().getEndTime(),
            rating.getTalk().getTrack(),
            rating.getTalk().getRoom()
        );
    }
    
    /**
     * Convert Rating entity to TalkRatingResponse DTO (for talk-specific queries)
     */
    public TalkRatingResponse toTalkRatingResponse(Rating rating) {
        if (rating == null) {
            return null;
        }
        
        return new TalkRatingResponse(
            rating.getId(),
            rating.getRating(),
            rating.getComment(),
            rating.getCreatedAt(),
            rating.getUpdatedAt(),
            rating.getUser().getId(),
            rating.getUser().getUsername()
        );
    }
    
    /**
     * Convert list of Rating entities to list of RatingResponse DTOs
     */
    public List<RatingResponse> toRatingResponseList(List<Rating> ratings) {
        if (ratings == null) {
            return null;
        }
        
        return ratings.stream()
                .map(this::toRatingResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Convert list of Rating entities to list of UserRatingResponse DTOs
     */
    public List<UserRatingResponse> toUserRatingResponseList(List<Rating> ratings) {
        if (ratings == null) {
            return null;
        }
        
        return ratings.stream()
                .map(this::toUserRatingResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Convert list of Rating entities to list of TalkRatingResponse DTOs
     */
    public List<TalkRatingResponse> toTalkRatingResponseList(List<Rating> ratings) {
        if (ratings == null) {
            return null;
        }
        
        return ratings.stream()
                .map(this::toTalkRatingResponse)
                .collect(Collectors.toList());
    }
}
