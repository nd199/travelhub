package com.naren.backend;

import com.naren.backend.repository.*;
import com.naren.backend.service.DataSeedingService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class TravelHubApplication {

    public static void main(String[] args) {
        SpringApplication.run(TravelHubApplication.class, args);
    }

    @Bean
    @ConditionalOnProperty(name = "app.data-initialization.enabled", havingValue = "true", matchIfMissing = true)
    public CommandLineRunner seedData( DataSeedingService dataSeedingService) {
        return args ->  {
            dataSeedingService.seedAllData();
        };
    }
}