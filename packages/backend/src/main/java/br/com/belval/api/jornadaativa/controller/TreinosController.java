package br.com.belval.api.jornadaativa.controller;

import br.com.belval.api.jornadaativa.dto.treino.TreinoCreateDTO;
import br.com.belval.api.jornadaativa.dto.treino.TreinoResponseDTO;
import br.com.belval.api.jornadaativa.dto.treino.TreinoUpdateDTO;
import br.com.belval.api.jornadaativa.model.entity.Treinos;
import br.com.belval.api.jornadaativa.model.service.TreinosService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/treinos")
public class TreinosController {

    private final TreinosService treinosService;

    @PostMapping
    public ResponseEntity<TreinoResponseDTO> criar(@Valid @RequestBody TreinoCreateDTO dto,
                                                   UriComponentsBuilder uriBuilder) {
        Treinos salvo = treinosService.criar(toEntity(dto));
        URI location = uriBuilder.path("/treinos/{id}").buildAndExpand(salvo.getId()).toUri();
        return ResponseEntity.created(location).body(toResponse(salvo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TreinoResponseDTO> buscarPorId(@PathVariable Long id) {
        Treinos treino = treinosService.buscarPorId(id);
        return ResponseEntity.ok(toResponse(treino));
    }

    @GetMapping
    public ResponseEntity<List<TreinoResponseDTO>> listar(
            @RequestParam(value = "nome", required = false) String nome
    ) {
        List<Treinos> lista = treinosService.listar(nome);
        return ResponseEntity.ok(lista.stream().map(this::toResponse).toList());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TreinoResponseDTO> atualizar(@PathVariable Long id,
                                                       @Valid @RequestBody TreinoUpdateDTO dto) {
        Treinos atualizado = treinosService.atualizar(id, toEntity(dto));
        return ResponseEntity.ok(toResponse(atualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        treinosService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    // ======= mapeamentos =======

    private Treinos toEntity(TreinoCreateDTO dto) {
        if (dto == null) return null;
        Treinos t = new Treinos();
        t.setNome(dto.getNome());
        t.setDescricao(dto.getDescricao());
        t.setNivel(dto.getNivel());
        t.setCreatedAt(LocalDateTime.now());
        return t;
    }

    private Treinos toEntity(TreinoUpdateDTO dto) {
        if (dto == null) return null;
        Treinos t = new Treinos();
        t.setNome(dto.getNome());
        t.setDescricao(dto.getDescricao());
        t.setNivel(dto.getNivel());
        return t;
    }

    private TreinoResponseDTO toResponse(Treinos t) {
        if (t == null) return null;
        TreinoResponseDTO dto = new TreinoResponseDTO();
        dto.setId(t.getId());
        dto.setNome(t.getNome());
        dto.setDescricao(t.getDescricao());
        dto.setCreatedAt(t.getCreatedAt());
        dto.setNivel(t.getNivel());
        return dto;
    }
}
