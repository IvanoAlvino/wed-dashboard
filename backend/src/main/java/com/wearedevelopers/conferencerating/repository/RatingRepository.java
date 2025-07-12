package com.wearedevelopers.conferencerating.repository;

import com.wearedevelopers.conferencerating.entity.Rating;
import com.wearedevelopers.conferencerating.entity.Talk;
import com.wearedevelopers.conferencerating.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    
    Optional<Rating> findByUserAndTalk(User user, Talk talk);
    
    List<Rating> findByUser(User user);
    
    List<Rating> findByTalk(Talk talk);
    
    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.talk = :talk")
    Double findAverageRatingByTalk(@Param("talk") Talk talk);
    
    @Query("SELECT COUNT(r) FROM Rating r WHERE r.talk = :talk")
    Long countRatingsByTalk(@Param("talk") Talk talk);
    
    Boolean existsByUserAndTalk(User user, Talk talk);
}
