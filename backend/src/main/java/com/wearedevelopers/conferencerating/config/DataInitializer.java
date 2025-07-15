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
        
        // Create conference attendee users if they don't exist
        if (userRepository.count() == 0) {
            createConferenceAttendees();
            System.out.println("Conference attendee users created successfully!");
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
    
    private void createConferenceAttendees() {
        String defaultPassword = "WED2025!temp";
        
        // Conference attendee list - replace with actual attendee data
        String[][] attendees = {
            {"Ivano Alvino", "ivano.alvino@navvis.com"},
            {"Martin Friedli", "martin.friedli@navvis.com"},
            {"Bruna Freitas", "bruna.freitas@navvis.com"},
            {"Ilke Oender", "oenderilke.sever@navvis.com"},
            {"Shashan", "kanishka.shashan@navvis.com"},
            {"Arun Muthiyarkath", "arun.muthiyarkath@navvis.com"},
            {"Atanas Georgiev", "atanas.georgiev@navvis.com"},
            {"Aleksei Domozhirov", "aleksei.domozhirov@navvis.com"},
            {"Elio Alvarado", "elio.alvarado@navvis.com"},
            {"Maksim Trukhanavets", "maksim.trukhanavets@navvis.com"},
            {"Manuel Kroeter", "manuel.kroeter@navvis.com"},
            {"Moaz Mohamed", "moaz.mohamed@navvis.com"},
            {"Ru Ko", "ru.ko@navvis.com"}
        };
        
        for (String[] attendee : attendees) {
            String fullName = attendee[0];
            String email = attendee[1];
            
            User user = new User(email, email, passwordEncoder.encode(defaultPassword));
            user.setFullName(fullName);
            user.setMustChangePassword(true);
            userRepository.save(user);
        }
        
        System.out.println("Created " + attendees.length + " conference attendees with default password: " + defaultPassword);
        System.out.println("All users must change their password on first login.");
    }
}
