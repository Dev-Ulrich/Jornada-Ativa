package br.com.belval.api.jornadaativa.controller;

import br.com.belval.api.jornadaativa.dto.historicoTreino.HistoricoTreinoCreateDTO;
import br.com.belval.api.jornadaativa.dto.historicoTreino.HistoricoTreinoResponseDTO;
import br.com.belval.api.jornadaativa.dto.historicoTreino.HistoricoTreinoUpdateDTO;
import br.com.belval.api.jornadaativa.model.entity.HistoricoTreinos;
import br.com.belval.api.jornadaativa.model.service.HistoricoTreinosService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/historico-treinos")
public class HistoricoTreinosController {

    private final HistoricoTreinosService historicoService;

    // CREATE
    @PostMapping
    public ResponseEntity<HistoricoTreinoResponseDTO> criar(
            @Valid @RequestBody HistoricoTreinoCreateDTO dto,
            UriComponentsBuilder uriBuilder
    ) {
        HistoricoTreinos salvo = historicoService.lancar(
                dto.getUsuarioId(),
                dto.getTreinoId(),
                toEntity(dto),
                null // pontos: se quiser suportar, adicione List<PontoDTO> no DTO
        );
        URI location = uriBuilder.path("/historico-treinos/{id}").buildAndExpand(salvo.getId()).toUri();
        return ResponseEntity.created(location).body(toResponse(salvo));
    }

    // READ by ID (regex evita capturar /usuario/...)
    @GetMapping("/{id}")
    public ResponseEntity<HistoricoTreinoResponseDTO> buscarPorId(@PathVariable Long id) {
        HistoricoTreinos historico = historicoService.buscarPorId(id);
        return ResponseEntity.ok(toResponse(historico));
    }

    // LIST por usuário - paginado: GET /historico-treinos/usuario/{usuarioId}?page=0&size=20
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Page<HistoricoTreinoResponseDTO>> listarPorUsuario(
            @PathVariable Long usuarioId,
            Pageable pageable
    ) {
        Page<HistoricoTreinos> page = historicoService.listarPorUsuario(usuarioId, pageable);
        return ResponseEntity.ok(page.map(this::toResponse));
    }

    // LIST por usuário - tudo: GET /historico-treinos/usuario/{usuarioId}/all
    @GetMapping("/usuario/{usuarioId}/all")
    public ResponseEntity<List<HistoricoTreinoResponseDTO>> listarTodosPorUsuario(
            @PathVariable Long usuarioId
    ) {
        List<HistoricoTreinos> lista = historicoService.listarPorUsuario(usuarioId);
        return ResponseEntity.ok(lista.stream().map(this::toResponse).toList());
    }

    // UPDATE parcial (PUT também chama o método parcial)
    @PutMapping("/{id}")
    public ResponseEntity<HistoricoTreinoResponseDTO> atualizar(
            @PathVariable Long id,
            @RequestBody HistoricoTreinoUpdateDTO dto
    ) {
        HistoricoTreinos atualizado = historicoService.atualizarParcial(id, dto);
        return ResponseEntity.ok(toResponse(atualizado));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        historicoService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    // ======= mappers =======

    private HistoricoTreinos toEntity(HistoricoTreinoCreateDTO dto) {
        if (dto == null) return null;
        HistoricoTreinos h = new HistoricoTreinos();
        h.setData(dto.getData());
        h.setTempo(dto.getTempo());
        h.setVMedia(dto.getVMedia());
        h.setDistancia(dto.getDistancia());
        h.setKcal(dto.getKcal());
        h.setPace(dto.getPace());
        return h;
    }

    private HistoricoTreinoResponseDTO toResponse(HistoricoTreinos h) {
        if (h == null) return null;
        return HistoricoTreinoResponseDTO.builder()
                .id(h.getId())
                .usuarioId(h.getUsuario() != null ? h.getUsuario().getId() : null)
                .treinoId(h.getTreino() != null ? h.getTreino().getId() : null)
                .data(h.getData())
                .tempo(h.getTempo())
                .vMedia(h.getVMedia())
                .distancia(h.getDistancia())
                .kcal(h.getKcal())
                .pace(h.getPace())
                .createdAt(h.getCreatedAt())
                .build();
    }
}
