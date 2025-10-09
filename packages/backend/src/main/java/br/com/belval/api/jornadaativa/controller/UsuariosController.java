package br.com.belval.api.jornadaativa.controller;


import br.com.belval.api.jornadaativa.dto.usuario.UsuariosCreateDTO;
import br.com.belval.api.jornadaativa.dto.usuario.UsuariosResponseDTO;
import br.com.belval.api.jornadaativa.dto.usuario.UsuariosUpdateDTO;
import br.com.belval.api.jornadaativa.model.entity.Role;
import br.com.belval.api.jornadaativa.model.entity.Usuarios;
import br.com.belval.api.jornadaativa.model.service.UsuariosService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuariosController {

    private final UsuariosService usuariosService;

    @PostMapping
    public ResponseEntity<UsuariosResponseDTO> criar(@Valid @RequestBody UsuariosCreateDTO dto) {
        Usuarios salvo = usuariosService.criarFromDto(dto);
        UsuariosResponseDTO body = toResponse(salvo);
        return ResponseEntity.created(URI.create("/api/usuarios/" + body.getId())).body(body);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuariosResponseDTO> buscarPorId(@PathVariable Long id) {
        Usuarios u = usuariosService.buscarPorId(id);
        return ResponseEntity.ok(toResponse(u));
    }

    @GetMapping
    public ResponseEntity<Page<UsuariosResponseDTO>> listar(Pageable pageable) {
        Page<Usuarios> page = usuariosService.listar(pageable);
        return ResponseEntity.ok(page.map(this::toResponse));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UsuariosResponseDTO> buscarPorEmail(@PathVariable String email) {
        Usuarios u = usuariosService.buscarPorEmail(email);
        return ResponseEntity.ok(toResponse(u));
    }

    @GetMapping("/count")
    public ResponseEntity<Long> contarUsuarios() {
        long total = usuariosService.contarUsuarios();
        return ResponseEntity.ok(total);
    }
    // Atualização completa (usa os campos presentes; os nulos são ignorados)
    @PutMapping("/{id}")
    public ResponseEntity<UsuariosResponseDTO> atualizar(@PathVariable Long id,
                                                         @Valid @RequestBody UsuariosUpdateDTO dto) {
        Usuarios atualizado = usuariosService.atualizarParcial(id, dto);
        return ResponseEntity.ok(toResponse(atualizado));
    }

    // Atualização parcial (PATCH) – mesma lógica do PUT acima
    @PatchMapping("/{id}")
    public ResponseEntity<UsuariosResponseDTO> atualizarParcial(@PathVariable Long id,
                                                                @RequestBody UsuariosUpdateDTO dto) {
        Usuarios atualizado = usuariosService.atualizarParcial(id, dto);
        return ResponseEntity.ok(toResponse(atualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String,Object>> deletar(@PathVariable Long id) {
        Map<String, Object> resposta = usuariosService.deletar(id);
        return ResponseEntity.ok(resposta);
    }

    // ------------------------------------
    // mapeamento Entidade -> DTO de saída
    private UsuariosResponseDTO toResponse(Usuarios u) {
        UsuariosResponseDTO dto = new UsuariosResponseDTO();
        dto.setId(u.getId());
        dto.setNome(u.getNome());
        dto.setEmail(u.getEmail());
        dto.setGenero(u.getGenero());
        dto.setDataNascimento(u.getDataNascimento());
        dto.setFtPerfil(u.getFtPerfil());
        dto.setNivel(u.getNivel());
        dto.setAltura(u.getAltura());
        dto.setPeso(u.getPeso());
        dto.setRole(resolveRole(u)); // não expõe senhaHash
        dto.setCreatedAt(u.getCreatedAt());
        dto.setUpdatedAt(u.getUpdatedAt());
        return dto;
    }



    // Usa o campo "role" (String) se preenchido;
    // senão, pega a primeira Role do Set<Role> (ROLE_*)
    private String resolveRole(Usuarios u) {
        if (u.getRole() != null && !u.getRole().isBlank()) return u.getRole();
        Optional<Role> first = u.getRoles().stream().findFirst();
        return first.map(r -> r.getName().name()).orElse(null);
    }
}
