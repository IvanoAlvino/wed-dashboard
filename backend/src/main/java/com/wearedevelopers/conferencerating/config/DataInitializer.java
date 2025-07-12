package com.wearedevelopers.conferencerating.config;

import com.wearedevelopers.conferencerating.entity.Talk;
import com.wearedevelopers.conferencerating.entity.User;
import com.wearedevelopers.conferencerating.repository.TalkRepository;
import com.wearedevelopers.conferencerating.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private TalkRepository talkRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        
        // Create sample users if they don't exist
        if (userRepository.count() == 0) {
            User user1 = new User("demo", "demo@example.com", passwordEncoder.encode("password"));
            User user2 = new User("admin", "admin@example.com", passwordEncoder.encode("password"));
            userRepository.save(user1);
            userRepository.save(user2);
        }
        
        // Create sample talks if they don't exist
        if (talkRepository.count() == 0) {
            
            // Day 1 - May 29, 2024
            LocalDate day1 = LocalDate.of(2024, 5, 29);
            
            Talk talk1 = new Talk("Keynote: The Future of Software Development", "Satya Nadella", day1, LocalTime.of(9, 0));
            talk1.setEndTime(LocalTime.of(10, 0));
            talk1.setDescription("An inspiring keynote about the future trends in software development and AI integration.");
            talk1.setTrack("Keynote");
            talk1.setRoom("Main Stage");
            
            Talk talk2 = new Talk("Building Scalable Microservices with Spring Boot", "Josh Long", day1, LocalTime.of(10, 30));
            talk2.setEndTime(LocalTime.of(11, 30));
            talk2.setDescription("Learn how to build and deploy scalable microservices using Spring Boot and cloud-native patterns.");
            talk2.setTrack("Backend");
            talk2.setRoom("Hall A");
            
            Talk talk3 = new Talk("Modern Frontend Development with Angular", "Manfred Steyer", day1, LocalTime.of(10, 30));
            talk3.setEndTime(LocalTime.of(11, 30));
            talk3.setDescription("Explore the latest features in Angular and best practices for modern web application development.");
            talk3.setTrack("Frontend");
            talk3.setRoom("Hall B");
            
            Talk talk4 = new Talk("DevOps Automation with GitHub Actions", "Kelsey Hightower", day1, LocalTime.of(12, 0));
            talk4.setEndTime(LocalTime.of(13, 0));
            talk4.setDescription("Streamline your development workflow with GitHub Actions and CI/CD best practices.");
            talk4.setTrack("DevOps");
            talk4.setRoom("Hall A");
            
            Talk talk5 = new Talk("Machine Learning in Production", "Cassie Kozyrkov", day1, LocalTime.of(14, 0));
            talk5.setEndTime(LocalTime.of(15, 0));
            talk5.setDescription("Practical approaches to deploying and maintaining machine learning models in production environments.");
            talk5.setTrack("AI/ML");
            talk5.setRoom("Hall B");
            
            // Day 2 - May 30, 2024
            LocalDate day2 = LocalDate.of(2024, 5, 30);
            
            Talk talk6 = new Talk("Cloud-Native Architecture Patterns", "Nana Janashia", day2, LocalTime.of(9, 0));
            talk6.setEndTime(LocalTime.of(10, 0));
            talk6.setDescription("Design patterns and best practices for building cloud-native applications.");
            talk6.setTrack("Cloud");
            talk6.setRoom("Main Stage");
            
            Talk talk7 = new Talk("React Performance Optimization", "Kent C. Dodds", day2, LocalTime.of(10, 30));
            talk7.setEndTime(LocalTime.of(11, 30));
            talk7.setDescription("Advanced techniques for optimizing React application performance and user experience.");
            talk7.setTrack("Frontend");
            talk7.setRoom("Hall A");
            
            Talk talk8 = new Talk("Security in Modern Web Applications", "Troy Hunt", day2, LocalTime.of(10, 30));
            talk8.setEndTime(LocalTime.of(11, 30));
            talk8.setDescription("Essential security practices and common vulnerabilities in modern web applications.");
            talk8.setTrack("Security");
            talk8.setRoom("Hall B");
            
            Talk talk9 = new Talk("Kubernetes Best Practices", "Brendan Burns", day2, LocalTime.of(12, 0));
            talk9.setEndTime(LocalTime.of(13, 0));
            talk9.setDescription("Production-ready Kubernetes deployment strategies and operational best practices.");
            talk9.setTrack("DevOps");
            talk9.setRoom("Hall A");
            
            Talk talk10 = new Talk("Building Developer Tools", "Jason Warner", day2, LocalTime.of(14, 0));
            talk10.setEndTime(LocalTime.of(15, 0));
            talk10.setDescription("Insights into creating effective developer tools and improving developer experience.");
            talk10.setTrack("Developer Experience");
            talk10.setRoom("Hall B");
            
            // Save all talks
            talkRepository.save(talk1);
            talkRepository.save(talk2);
            talkRepository.save(talk3);
            talkRepository.save(talk4);
            talkRepository.save(talk5);
            talkRepository.save(talk6);
            talkRepository.save(talk7);
            talkRepository.save(talk8);
            talkRepository.save(talk9);
            talkRepository.save(talk10);
            
            System.out.println("Sample data initialized successfully!");
        }
    }
}
