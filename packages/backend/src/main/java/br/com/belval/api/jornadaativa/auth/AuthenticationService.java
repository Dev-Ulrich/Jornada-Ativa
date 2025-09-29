package br.com.belval.api.jornadaativa.auth;

import br.com.belval.api.jornadaativa.exceptions.BadRequest;
import br.com.belval.api.jornadaativa.jwt.JwtService;
import br.com.belval.api.jornadaativa.model.entity.Usuario;
import br.com.belval.api.jornadaativa.model.repository.UsuarioRepository;
import br.com.belval.api.jornadaativa.token.Token;
import br.com.belval.api.jornadaativa.token.TokenRepository;
import br.com.belval.api.jornadaativa.token.TokenType;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

@Service
public class AuthenticationService {
    private final UsuarioRepository repository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(UsuarioRepository repository, TokenRepository tokenRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.repository = repository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthenticationResponse register(RegisterRequest request) {
        String nomeClasse = String.valueOf(request.getRole()).toLowerCase();
        char primeiroCharMaiusculo = Character.toUpperCase(nomeClasse.charAt(0));
        nomeClasse = nomeClasse.substring(1);
        nomeClasse = primeiroCharMaiusculo + nomeClasse;

        try {
            Optional<Usuario> usuarioDb = repository.findByEmail(request.getEmail());
            if (usuarioDb.isPresent()) {
                throw new BadRequest("Já existe este email cadastrado em nossa base de dados");
            }

            Class<?> clazz = Class.forName("br.com.belval.api.jornadaativa.model.entity." + nomeClasse);
            Usuario usuario = (Usuario) clazz.getDeclaredConstructor().newInstance();
            usuario.setNome(request.getNome());
            usuario.setEmail(request.getEmail());
            usuario.setPassword(passwordEncoder.encode(request.getPassword()));
            usuario.setRole(request.getRole());

            Usuario savedUser = repository.save(usuario);
            String jwtToken = jwtService.generateToken(savedUser);
            String refreshToken = jwtService.generateRefreshToken(savedUser);

            saveUserToken(savedUser, jwtToken);
            return new AuthenticationResponse(jwtToken, refreshToken);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        }
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (Exception e) {
            throw new BadRequest("Email ou Password Incorreto");
        }
        Usuario user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequest("Usuário não encontrado"));
        if (!user.isCodStatus()) {
            throw new BadRequest("Conta inativa, por favor procurar o administrador da conta");
        }
        String jwtToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);

        return new AuthenticationResponse(jwtToken, refreshToken);
    }

    private void saveUserToken(Usuario usuario, String jwtToken) {
        Token token = new Token();
        token.setUsuario(usuario);
        token.setToken(jwtToken);
        token.setTokenType(TokenType.BEARER);
        token.setExpired(false);
        token.setRevoked(false);
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(Usuario usuario) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(usuario.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return;
        }
        refreshToken = authHeader.substring(7);
        userEmail = jwtService.extractUsername(refreshToken);
        if (userEmail != null) {
            Usuario user = this.repository.findByEmail(userEmail)
                    .orElseThrow(() -> new BadRequest("Usuário não encontrado"));
            if (jwtService.isTokenValid(refreshToken, user)) {
                String accessToken = jwtService.generateToken(user);
                revokeAllUserTokens(user);
                saveUserToken(user, accessToken);
                AuthenticationResponse authResponse = new AuthenticationResponse(accessToken, refreshToken);
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
        }
    }
}
