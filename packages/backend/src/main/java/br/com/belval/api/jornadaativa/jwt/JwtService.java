package br.com.belval.api.jornadaativa.jwt;

import br.com.belval.api.jornadaativa.model.entity.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Duration;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${application.security.jwt.secret-key}")
    private String secretKey;
    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;
    @Value("${application.security.jwt.refresh-token.expiration}")
    private long refreshExpiration;

    private Key getSignInKey () {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private Claims extractAllClaims (String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public <T> T extractClaims (String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String extractUsername (String token) {
        return extractClaims(token, Claims::getSubject);
    }

    public Date extractExpiration (String token) {
        return extractClaims(token, Claims::getExpiration);
    }

    private String buildToken(Map<String, Object> extraClaims, UserDetails userDetails, long expiration) {
        ZoneId saoPauloZone = ZoneId.of("America/Sao_Paulo");
        ZonedDateTime agora = ZonedDateTime.now(saoPauloZone);
        ZonedDateTime expira = agora.plus(Duration.ofMillis(expiration));
        return Jwts.builder().setClaims(extraClaims).setSubject(userDetails.getUsername())
                .setIssuedAt(Date.from(agora.toInstant()))
                .setExpiration(Date.from(expira.toInstant()))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256).compact();
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        if(userDetails instanceof Usuario usuario) {
            extraClaims.put("role", usuario.getRole().name());
            extraClaims.put("id", usuario.getId());
        }
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateRefreshToken(UserDetails userDetails) {
        return buildToken(new HashMap<>(), userDetails, refreshExpiration);
    }
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

}
