package com.wearedevelopers.conferencerating.config;

import com.wearedevelopers.conferencerating.entity.Talk;
import com.wearedevelopers.conferencerating.entity.User;
import com.wearedevelopers.conferencerating.repository.TalkRepository;
import com.wearedevelopers.conferencerating.repository.UserRepository;
import com.wearedevelopers.conferencerating.service.JsonDataLoader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private TalkRepository talkRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JsonDataLoader jsonDataLoader;
    
    @Override
    public void run(String... args) throws Exception {
        
        // Create sample users if they don't exist
        if (userRepository.count() == 0) {
            User user1 = new User("demo", "demo@example.com", passwordEncoder.encode("password"));
            User user2 = new User("admin", "admin@example.com", passwordEncoder.encode("password"));
            userRepository.save(user1);
            userRepository.save(user2);
            System.out.println("Sample users created successfully!");
        }
        
        // Load talks from JSON if they don't exist
        if (talkRepository.count() == 0) {
            try {
                List<Talk> talks = jsonDataLoader.loadTalksFromJson();
                talkRepository.saveAll(talks);
                System.out.println("Conference data loaded successfully from JSON! Total talks: " + talks.size());
            } catch (Exception e) {
                System.err.println("Failed to load conference data from JSON: " + e.getMessage());
                e.printStackTrace();
                // Application will fail to start if JSON loading fails
                throw new RuntimeException("Failed to initialize conference data", e);
            }
        }
    }
}
