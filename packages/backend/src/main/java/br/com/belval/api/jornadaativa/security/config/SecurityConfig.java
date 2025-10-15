package br.com.belval.api.jornadaativa.security.config;

import br.com.belval.api.jornadaativa.security.jwt.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtFilter;

    public SecurityConfig(JwtAuthFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http, AuthenticationProvider authProvider) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/login", "/actuator/health", "/health").permitAll()
                        // Dashboard (rotas apenas de admin)
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        // Rotas do app (user e admin)
                        .requestMatchers("/api/**").hasAnyRole("ADMIN","USER")
                        // todo o resto autenticado
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authProvider)
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    AuthenticationProvider daoAuthProvider(UserDetailsService uds, PasswordEncoder enc) {
        var p = new DaoAuthenticationProvider();
        p.setUserDetailsService(uds);
        p.setPasswordEncoder(enc);
        return p;
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource(
            @Value("${app.cors.allowed-origins:*}") String origins,
            @Value("${app.cors.allowed-methods:GET,POST,PUT,PATCH,DELETE,OPTIONS}") String methods,
            @Value("${app.cors.allowed-headers:Authorization,Content-Type,Accept,Origin}") String headers,
            @Value("${app.cors.exposed-headers:Authorization}") String exposed,
            @Value("${app.cors.allow-credentials:true}") boolean allowCreds
    ) {
        var cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(Arrays.stream(origins.split("\\s*,\\s*")).toList());
        cfg.setAllowedMethods(Arrays.stream(methods.split("\\s*,\\s*")).toList());
        cfg.setAllowedHeaders(Arrays.stream(headers.split("\\s*,\\s*")).toList());
        cfg.setExposedHeaders(Arrays.stream(exposed.split("\\s*,\\s*")).toList());
        cfg.setAllowCredentials(allowCreds);
        var src = new UrlBasedCorsConfigurationSource();
        src.registerCorsConfiguration("/**", cfg);
        return src;
    }
}
