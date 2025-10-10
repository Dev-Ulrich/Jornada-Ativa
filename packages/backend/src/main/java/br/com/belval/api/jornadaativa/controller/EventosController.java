package br.com.belval.api.jornadaativa.controller;

import br.com.belval.api.jornadaativa.dto.evento.EventoCreateDTO;
import br.com.belval.api.jornadaativa.dto.evento.EventoResponseDTO;
import br.com.belval.api.jornadaativa.dto.evento.EventoUpdateDTO;
import br.com.belval.api.jornadaativa.model.entity.Eventos;
import br.com.belval.api.jornadaativa.model.service.EventosService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/eventos")
public class EventosController {

    private final EventosService eventosService;

    // POST /eventos -> cria (DTO -> Entity)
    @PostMapping
    public ResponseEntity<EventoResponseDTO> criar(@Valid @RequestBody EventoCreateDTO dto,
                                                   UriComponentsBuilder uriBuilder) {
        Eventos salvo = eventosService.criar(toEntity(dto));
        URI location = uriBuilder.path("/eventos/{id}").buildAndExpand(salvo.getId()).toUri(); // getId()
        return ResponseEntity.created(location).body(toResponse(salvo));
    }

    // GET /eventos/{id}
    @GetMapping("/{id}")
    public ResponseEntity<EventoResponseDTO> buscarPorId(@PathVariable Long id) {
        Eventos e = eventosService.buscarPorId(id);
        return ResponseEntity.ok(toResponse(e));
    }

    // GET /eventos?nome=...
    @GetMapping
    public ResponseEntity<List<EventoResponseDTO>> listar(
            @RequestParam(value = "nome", required = false) String nome
    ) {
        List<Eventos> lista = eventosService.listar(nome);
        return ResponseEntity.ok(lista.stream().map(this::toResponse).toList());
    }

    // GET /eventos/proximos?aPartirDe=yyyy-MM-dd
    @GetMapping("/proximos")
    public ResponseEntity<List<EventoResponseDTO>> proximos(
            @RequestParam(value = "aPartirDe", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate aPartirDe
    ) {
        List<Eventos> lista = eventosService.proximos(aPartirDe);
        return ResponseEntity.ok(lista.stream().map(this::toResponse).toList());
    }

    @GetMapping("/metricas/por-mes")
    public ResponseEntity<Map<Integer, Long>> eventosPorMes(
            @RequestParam int ano) {
        Map<Integer, Long> metricas = eventosService.contarEventosPorMes(ano);
        return ResponseEntity.ok(metricas);
    }


    // 🔹 Total geral
    @GetMapping("/count")
    public ResponseEntity<Long> contarEventos() {
        long total = eventosService.contarEventos();
        return ResponseEntity.ok(total);
    }

    // 🔹 Total de eventos ativos
    @GetMapping("/ativos/count")
    public ResponseEntity<Long> contarEventosAtivos() {
        long total = eventosService.contarEventosAtivos();
        return ResponseEntity.ok(total);
    }

    // PUT /eventos/{id} -> atualizar (DTO -> Entity)
    @PutMapping("/{id}")
    public ResponseEntity<EventoResponseDTO> atualizar(@PathVariable Long id,
                                                       @Valid @RequestBody EventoUpdateDTO dto) {
        Eventos atualizado = eventosService.atualizar(id, toEntity(dto));
        return ResponseEntity.ok(toResponse(atualizado));
    }

    // DELETE /eventos/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        eventosService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    // ======= mapeamentos =======

    private Eventos toEntity(EventoCreateDTO dto) {
        if (dto == null) return null;
        Eventos e = new Eventos();
        e.setNome(dto.getNome());
        e.setDescricao(dto.getDescricao());
        e.setImagemEvento(dto.getImagemEvento());
        e.setDataEvento(dto.getDataEvento());
        e.setLinkEvento(dto.getLinkEvento());
        e.setStatus(dto.getStatus());
        return e;
    }

    private Eventos toEntity(EventoUpdateDTO dto) {
        if (dto == null) return null;
        Eventos e = new Eventos();
        // campos opcionais: o service deve aplicar "patch" de não-nulos
        e.setNome(dto.getNome());
        e.setDescricao(dto.getDescricao());
        e.setImagemEvento(dto.getImagemEvento());
        e.setDataEvento(dto.getDataEvento());
        e.setLinkEvento(dto.getLinkEvento());
        e.setStatus(dto.getStatus());
        return e;
    }

    private EventoResponseDTO toResponse(Eventos e) {
        if (e == null) return null;
        EventoResponseDTO dto = new EventoResponseDTO();
        dto.setId(e.getId()); // <- getId()
        dto.setNome(e.getNome());
        dto.setDescricao(e.getDescricao());
        dto.setImagemEvento(e.getImagemEvento());
        dto.setDataEvento(e.getDataEvento());
        dto.setLinkEvento(e.getLinkEvento());
        dto.setStatus(e.getStatus());
        dto.setCreatedAt(e.getCreatedAt());
        return dto;
    }
}
