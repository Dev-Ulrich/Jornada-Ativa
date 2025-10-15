package br.com.belval.api.jornadaativa.security.jwt;


import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtService {

    @Value("${application.security.jwt.secret-key}")
    private String secret;

    @Value("${application.security.jwt.expiration}")
    private long accessExpirationMs;

    @Value("${application.security.jwt.refresh-token.expiration}")
    private long refreshExpirationMs;

    @PostConstruct
    void validateProps() {
        if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalStateException("JWT secret-key deve ter pelo menos 32 bytes. Ajuste application.security.jwt.secret-key");
        }
        if (accessExpirationMs <= 0) {
            throw new IllegalStateException("JWT expiration deve ser > 0 ms. Ajuste application.security.jwt.expiration");
        }
    }

    private Key key() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(UserDetails user) {
        var now = new Date();
        var exp = new Date(now.getTime() + /* seu expiration ms aqui */ 86400000);

        var roles = user.getAuthorities().stream()
                .map(a -> a.getAuthority()) // "ROLE_ADMIN", "ROLE_USER"
                .collect(Collectors.toList());

        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("roles", roles)   // <<<<< ADICIONA AS ROLES NO PAYLOAD
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token).getBody().getSubject();
    }

    public boolean isValid(String token, UserDetails user) {
        try {
            var claims = Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token).getBody();

            return user.getUsername().equals(claims.getSubject())
                && claims.getExpiration().after(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
