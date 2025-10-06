package br.com.belval.api.jornadaativa.controller;

import br.com.belval.api.jornadaativa.dto.treinoPontoGPS.PontoGPSCreateDTO;
import br.com.belval.api.jornadaativa.dto.treinoPontoGPS.PontoGPSResponseDTO;
import br.com.belval.api.jornadaativa.model.entity.TreinosPontosGPS;
import br.com.belval.api.jornadaativa.model.entity.HistoricoTreinos;
import br.com.belval.api.jornadaativa.model.service.TreinosPontosGPSService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/treinos-pontos-gps")
public class TreinosPontosGPSController {

    private final TreinosPontosGPSService pontosService;

    @PostMapping("/batch")
    public ResponseEntity<List<PontoGPSResponseDTO>> adicionarEmLote(
            @Valid @RequestBody List<PontoGPSCreateDTO> dtos) {
        List<TreinosPontosGPS> salvos = pontosService.adicionarEmLote(
                dtos.stream().map(this::toEntity).toList()
        );
        return ResponseEntity.ok(salvos.stream().map(this::toResponse).toList());
    }

    @GetMapping("/historico/{historicoId}")
    public ResponseEntity<List<PontoGPSResponseDTO>> listarPorHistorico(@PathVariable Long historicoId) {
        List<TreinosPontosGPS> pontos = pontosService.buscarPorHistorico(historicoId);
        return ResponseEntity.ok(pontos.stream().map(this::toResponse).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PontoGPSResponseDTO> buscarPorId(@PathVariable Long id) {
        TreinosPontosGPS ponto = pontosService.buscarPorId(id);
        return ResponseEntity.ok(toResponse(ponto));
    }

    @DeleteMapping("/historico/{historicoId}")
    public ResponseEntity<Void> excluirPorHistorico(@PathVariable Long historicoId) {
        pontosService.excluirPorHistorico(historicoId);
        return ResponseEntity.noContent().build();
    }

    // ======= mappers =======

    private TreinosPontosGPS toEntity(PontoGPSCreateDTO dto) {
        if (dto == null) return null;
        TreinosPontosGPS ponto = new TreinosPontosGPS();
        ponto.setHistoricoTreino(new HistoricoTreinos(dto.getHistoricoTreinoId()));
        ponto.setLatitude(BigDecimal.valueOf(dto.getLatitude()));
        ponto.setLongitude(BigDecimal.valueOf(dto.getLongitude()));
        ponto.setMomento(dto.getMomento() != null ? dto.getMomento() : LocalDateTime.now());
        return ponto;
    }

    private PontoGPSResponseDTO toResponse(TreinosPontosGPS ponto) {
        if (ponto == null) return null;
        return PontoGPSResponseDTO.builder()
                .id(ponto.getId())
                .historicoTreinoId(
                        ponto.getHistoricoTreino() != null ? ponto.getHistoricoTreino().getId() : null
                )
                .latitude(ponto.getLatitude() != null ? ponto.getLatitude().doubleValue() : null)
                .longitude(ponto.getLongitude() != null ? ponto.getLongitude().doubleValue() : null)
                .momento(ponto.getMomento())
                .build();
    }
}
