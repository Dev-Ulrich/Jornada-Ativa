package br.com.belval.api.jornadaativa.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        // delegating: padrão {bcrypt}
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // REST = sem CSRF e sem sessão
                .cors(c -> {})
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Habilita CORS (usa o CorsFilter do bean abaixo)
                .cors(Customizer.withDefaults())

                // Autorização
                .authorizeHttpRequests(auth -> auth
                        // Libera preflight (CORS)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Health público
                        .requestMatchers(HttpMethod.GET, "/health").permitAll()

                        // Cadastro público
                        .requestMatchers(HttpMethod.POST, "/usuarios").permitAll()

                        // (Se tiver versionamento, repita para /api/v1/health e /api/v1/usuarios)

                        // Demais rotas exigem auth
                        .anyRequest().authenticated()
                )

                // Autenticação via HTTP Basic (ótimo pra Postman e testes iniciais no front)
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}
