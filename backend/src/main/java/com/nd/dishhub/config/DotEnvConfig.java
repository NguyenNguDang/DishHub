package com.nd.dishhub.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class to load environment variables from .env file
 * This runs before Spring Boot initializes to ensure variables are available
 */
@Configuration
public class DotEnvConfig {
    
    public DotEnvConfig() {
        // Load .env file from the classpath or project root
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();
        
        // Set all environment variables from .env file as system properties
        // This allows Spring Boot to resolve ${VARIABLE_NAME} placeholders
        dotenv.entries().forEach(entry -> {
            String key = entry.getKey();
            String value = entry.getValue();
            if (System.getProperty(key) == null) {
                System.setProperty(key, value);
            }
        });
    }
}

