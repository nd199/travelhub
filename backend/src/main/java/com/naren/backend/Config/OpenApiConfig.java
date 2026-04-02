package com.naren.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("TravelHub Transport Booking API")
                        .version("1.0.0")
                        .description("REST API for managing transport bookings, schedules, vehicles, and users")
                        .contact(new Contact()
                                .name("Narendran")
                                .email("naren06251999@example.com"))
                        .description("A TravelHub Transport Booking API"));
    }
}
