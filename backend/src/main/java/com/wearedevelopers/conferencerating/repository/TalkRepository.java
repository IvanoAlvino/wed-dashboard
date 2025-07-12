package com.wearedevelopers.conferencerating.repository;

import com.wearedevelopers.conferencerating.entity.Talk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TalkRepository extends JpaRepository<Talk, Long> {
    
    List<Talk> findByDateOrderByStartTimeAsc(LocalDate date);
    
    @Query("SELECT DISTINCT t.date FROM Talk t ORDER BY t.date ASC")
    List<LocalDate> findDistinctDatesOrderByDate();
    
    @Query("SELECT t FROM Talk t ORDER BY t.date ASC, t.startTime ASC")
    List<Talk> findAllOrderByDateAndTime();
    
    List<Talk> findByTrackOrderByDateAscStartTimeAsc(String track);
}
