package br.com.belval.api.jornadaativa.security;


import br.com.belval.api.jornadaativa.model.entity.Usuarios;
import br.com.belval.api.jornadaativa.model.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuarios u = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + email));

        // 1) Usa ManyToMany< Role >
        Set<GrantedAuthority> authorities = u.getRoles() != null && !u.getRoles().isEmpty()
                ? u.getRoles().stream()
                // Role tem getName() (enum RoleName ou String). Ajuste se seu getter tiver outro nome.
                .map(r -> {
                    String name = r.getName() instanceof Enum ? ((Enum<?>) r.getName()).name() : String.valueOf(r.getName());
                    String roleName = name.toUpperCase().startsWith("ROLE_") ? name.toUpperCase() : "ROLE_" + name.toUpperCase();
                    return new SimpleGrantedAuthority(roleName);
                })
                .collect(Collectors.toSet())
                // 2) Se não houver ManyToMany, usa o campo 'role' da entidade Usuarios
                : Set.of(new SimpleGrantedAuthority(
                (u.getRole() != null && !u.getRole().isBlank())
                        ? (u.getRole().toUpperCase().startsWith("ROLE_") ? u.getRole().toUpperCase() : "ROLE_" + u.getRole().toUpperCase())
                        : "ROLE_USER"
        ));

        return User.withUsername(u.getEmail())
                .password(u.getSenhaHash()) // já vem hasheada (BCrypt)
                .authorities(authorities)
                .accountExpired(false).accountLocked(false).credentialsExpired(false).disabled(false)
                .build();
    }
    }

