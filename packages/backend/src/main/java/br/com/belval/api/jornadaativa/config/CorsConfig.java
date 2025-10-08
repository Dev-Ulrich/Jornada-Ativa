package br.com.belval.api.jornadaativa.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOriginPatterns("http://localhost:*", "http://127.0.0.1:*", "null", "*")
                        .allowedMethods("*")                 // aceita todos os métodos (GET/POST/PUT/DELETE/PATCH/OPTIONS)
                        .allowedHeaders("*")                 // evita falha por 'authorization'/'content-type' no preflight
                        .exposedHeaders("Authorization")
                        .allowCredentials(true)              // ok com allowedOriginPatterns
                        .maxAge(3600);
            }
        };
    }
}