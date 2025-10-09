package br.com.belval.api.jornadaativa.model.service;

import br.com.belval.api.jornadaativa.dto.usuario.UsuariosUpdateDTO;
import br.com.belval.api.jornadaativa.exceptions.Business;
import br.com.belval.api.jornadaativa.dto.usuario.UsuariosCreateDTO;
import br.com.belval.api.jornadaativa.model.entity.Role;
import br.com.belval.api.jornadaativa.model.entity.Usuarios;
import br.com.belval.api.jornadaativa.model.entity.RoleName;
import br.com.belval.api.jornadaativa.model.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UsuariosService {

    private final UsuarioRepository usuarioRepository;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;

    public long contarUsuarios() {
        return usuarioRepository.count();
    }

    @Transactional
    public Usuarios criarFromDto(UsuariosCreateDTO dto) {
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new Business("E-mail já cadastrado.");
        }

        Usuarios usuario = new Usuarios();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenhaHash(passwordEncoder.encode(dto.getSenha()));
        usuario.setGenero(dto.getGenero());
        usuario.setDataNascimento(dto.getDataNascimento());
        usuario.setFtPerfil(dto.getFtPerfil());
        usuario.setNivel(dto.getNivel());
        usuario.setAltura(dto.getAltura());
        usuario.setPeso(dto.getPeso());

        // 1️⃣ salva o usuário primeiro (gera o id)
        Usuarios salvo = usuarioRepository.save(usuario);

        // 2️⃣ associa a role já existente e gerenciada
        RoleName roleName = toRoleName(dto.getRole());
        Role role = roleService.getOrThrow(roleName);

        salvo.getRoles().add(role);
        return usuarioRepository.save(salvo);
    }

    @Transactional(readOnly = true)
    public Usuarios buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new Business("Usuário não encontrado: id=" + id));
    }

    @Transactional(readOnly = true)
    public Page<Usuarios> listar(Pageable pageable) {
        return usuarioRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Usuarios buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new Business("Usuário não encontrado para o e-mail: " + email));
    }

    @Transactional
    public Usuarios atualizarParcial(Long id, UsuariosUpdateDTO dto) {
        Usuarios u = buscarPorId(id);

        if (dto.getNome() != null) u.setNome(dto.getNome());

        if (dto.getEmail() != null && !dto.getEmail().equalsIgnoreCase(u.getEmail())) {
            usuarioRepository.findByEmail(dto.getEmail())
                    .filter(existente -> !existente.getId().equals(id))
                    .ifPresent(ex -> {
                        throw new Business("E-mail já cadastrado.");
                    });
            u.setEmail(dto.getEmail());
        }

        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            u.setSenhaHash(passwordEncoder.encode(dto.getSenha()));
        }

        if (dto.getGenero() != null) u.setGenero(dto.getGenero());
        if (dto.getDataNascimento() != null) u.setDataNascimento(dto.getDataNascimento());
        if (dto.getFtPerfil() != null) u.setFtPerfil(dto.getFtPerfil());
        if (dto.getNivel() != null) u.setNivel(dto.getNivel());
        if (dto.getAltura() != null) u.setAltura(dto.getAltura());
        if (dto.getPeso() != null) u.setPeso(dto.getPeso());

        if (dto.getRole() != null && !dto.getRole().isBlank()) {
            RoleName roleName = toRoleName(dto.getRole());
            Role role = roleService.getOrThrow(roleName);
            u.getRoles().clear();
            u.getRoles().add(role);
            u.setRole(roleName.name()); // mantém a coluna string sincronizada (opcional)
        }

        u.setUpdatedAt(java.time.LocalDateTime.now());
        return usuarioRepository.save(u);
    }

    @Transactional
    public Map<String, Object> deletar(Long id) {
        Optional<Usuarios> usuario = usuarioRepository.findById(id);
        if (usuario.isEmpty()) {
            throw new Business("Usuário não encontrado para exclusão (ID: " + id + ")");
        }
        usuarioRepository.deleteById(id);

        return Map.of(
                "message", "Usuário deletado com sucesso.",
                "userId", id
        );
    }

    private RoleName toRoleName(String roleStr) {
        if (roleStr == null || roleStr.isBlank()) {
            throw new Business("Role inválida.");
        }
        String normalized = roleStr.trim().toUpperCase();
        if (!normalized.startsWith("ROLE_")) normalized = "ROLE_" + normalized;
        try {
            return RoleName.valueOf(normalized);
        } catch (IllegalArgumentException ex) {
            throw new Business("Role inválida: " + normalized);
        }
    }
}
