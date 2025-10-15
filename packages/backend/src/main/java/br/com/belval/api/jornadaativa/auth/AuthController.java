package br.com.belval.api.jornadaativa.auth;


import br.com.belval.api.jornadaativa.auth.dto.LoginRequest;
import br.com.belval.api.jornadaativa.auth.dto.RegisterRequest;
import br.com.belval.api.jornadaativa.auth.dto.TokenResponse;
import br.com.belval.api.jornadaativa.model.entity.RoleName;
import br.com.belval.api.jornadaativa.model.entity.Usuarios;
import br.com.belval.api.jornadaativa.model.repository.RoleRepository;
import br.com.belval.api.jornadaativa.model.repository.UsuarioRepository;
import br.com.belval.api.jornadaativa.security.jwt.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtService jwt;
    private final UsuarioRepository usuarios;
    private final RoleRepository roles;
    private final PasswordEncoder encoder;

    public AuthController(
            AuthenticationConfiguration cfg,
            JwtService jwt,
            UsuarioRepository usuarios,
            RoleRepository roles,
            PasswordEncoder encoder
    ) throws Exception {
        this.authManager = cfg.getAuthenticationManager();
        this.jwt = jwt;
        this.usuarios = usuarios;
        this.roles = roles;
        this.encoder = encoder;
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {
        return ResponseEntity.ok(auth.getName()); // email do user logado
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @jakarta.validation.Valid LoginRequest req) {
        // 1) existe usuário com esse e-mail?
        var uOpt = usuarios.findByEmail(req.email());
        if (uOpt.isEmpty()) {
            return ResponseEntity.status(401).body("E-mail não encontrado"); // diagnostico claro
        }

        var u = uOpt.get();

        // 2) a senha enviada bate com o hash (BCrypt) salvo?
        if (!encoder.matches(req.password(), u.getSenhaHash())) {
            return ResponseEntity.status(401).body("Senha incorreta"); // diagnostico claro
        }

        // 3) se bateu, então deixa o AuthenticationManager seguir o fluxo normal
        var auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password())
        );
        var token = jwt.generateToken((UserDetails) auth.getPrincipal());
        return ResponseEntity.ok(new TokenResponse(token));
    }


    /**
     * Registro simples – preenche mínimos obrigatórios do seu schema.
     * Se você já tiver um fluxo próprio de cadastro, pode remover este endpoint.
     */
    @PostMapping("/register")
    @Transactional
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (usuarios.findByEmail(req.email()).isPresent()) {
            return ResponseEntity.status(409).body("E-mail já cadastrado");
        }

        var u = new Usuarios();
        u.setNome(req.nome() != null && !req.nome().isBlank() ? req.nome() : req.email());
        u.setEmail(req.email());
        u.setSenhaHash(encoder.encode(req.password()));
        u.setGenero(req.genero() != null ? req.genero() : "N/D");
        u.setDataNascimento(req.dataNascimento() != null ? req.dataNascimento() : LocalDate.of(2000,1,1));
        u.setFtPerfil(null);
        u.setNivel(req.nivel() != null ? req.nivel() : "INICIANTE");
        u.setAltura(req.altura() != null ? req.altura() : null);
        u.setPeso(req.peso() != null ? req.peso() : null);

        // Role padrão (enum)
        var roleName = req.role() != null ? req.role() : RoleName.ROLE_USER;
        var role = roles.findByName(roleName);
        roles.findByName(roleName)
                .ifPresent(u.getRoles()::add);


        usuarios.save(u);
        return ResponseEntity.status(201).build();
    }
}
