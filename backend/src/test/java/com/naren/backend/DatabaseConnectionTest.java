package com.naren.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("prod")
class DatabaseConnectionTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void testDatabaseConnection() {
        // Test PostgreSQL connection from Docker
        Integer count = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'", 
            Integer.class
        );
        
        assertNotNull(count);
        System.out.println("Connected to PostgreSQL successfully!");
        System.out.println("Table count: " + count);
        
        // Test a simple query
        String result = jdbcTemplate.queryForObject(
            "SELECT current_database()", 
            String.class
        );
        
        assertNotNull(result);
        System.out.println("Current database: " + result);
    }
}
