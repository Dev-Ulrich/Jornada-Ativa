package br.com.belval.api.jornadaativa.model.service;

import br.com.belval.api.jornadaativa.dto.historicoTreino.HistoricoTreinoUpdateDTO;
import br.com.belval.api.jornadaativa.exceptions.NotFound;
import br.com.belval.api.jornadaativa.model.entity.HistoricoTreinos;
import br.com.belval.api.jornadaativa.model.entity.Treinos;
import br.com.belval.api.jornadaativa.model.entity.TreinosPontosGPS;
import br.com.belval.api.jornadaativa.model.entity.Usuarios;
import br.com.belval.api.jornadaativa.model.repository.HistoricoTreinosRepository;
import br.com.belval.api.jornadaativa.model.repository.TreinosPontosGPSRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HistoricoTreinosService {

    private final HistoricoTreinosRepository historicoRepository;
    private final TreinosPontosGPSRepository pontosRepository;
    private final UsuariosService usuariosService;
    private final TreinosService treinosService;

    // =========================
    // CREATE (lançamento)
    // =========================
    @Transactional
    public HistoricoTreinos lancar(Long usuarioId, Long treinoId,
                                   HistoricoTreinos dados,
                                   List<TreinosPontosGPS> pontos) {
        // vincula usuário (obrigatório)
        Usuarios usuario = usuariosService.buscarPorId(usuarioId);
        dados.setUsuario(usuario);

        // vincula treino (opcional)
        if (treinoId != null) {
            Treinos treino = treinosService.buscarPorId(treinoId);
            dados.setTreino(treino);
        }

        HistoricoTreinos salvo = historicoRepository.save(dados);

        // persiste pontos, se houver
        if (pontos != null && !pontos.isEmpty()) {
            for (TreinosPontosGPS p : pontos) {
                p.setHistoricoTreino(salvo);
            }
            pontosRepository.saveAll(pontos);
        }
        return salvo;
    }

    // =========================
    // UPDATE PARCIAL (null-safe)
    // =========================
    @Transactional
    public HistoricoTreinos atualizarParcial(Long id, HistoricoTreinoUpdateDTO dto) {
        HistoricoTreinos existente = buscarPorId(id);

        // Campos simples
        if (dto.getData() != null) existente.setData(dto.getData());
        if (dto.getTempo() != null) existente.setTempo(dto.getTempo());
        if (dto.getVMedia() != null) existente.setVMedia(dto.getVMedia());
        if (dto.getDistancia() != null) existente.setDistancia(dto.getDistancia());
        if (dto.getKcal() != null) existente.setKcal(dto.getKcal());
        if (dto.getPace() != null) existente.setPace(dto.getPace());

        // Troca de Treino (opcional)
        if (dto.getTreinoId() != null) {
            Treinos treino = treinosService.buscarPorId(dto.getTreinoId());
            existente.setTreino(treino);
        }

        // Troca de Usuário (opcional)
        if (dto.getUsuarioId() != null) {
            Usuarios usuario = usuariosService.buscarPorId(dto.getUsuarioId());
            existente.setUsuario(usuario);
        }

        // Observação:
        // Dirty checking do JPA já faz o UPDATE; o save aqui é explícito
        return historicoRepository.save(existente);
    }

    // =========================
    // UPDATE COMPLETO (opcional)
    // Se preferir manter um PUT "completo", garanta que o controller
    // só chame esse método quando TODOS os campos vierem preenchidos.
    // =========================
    @Transactional
    public HistoricoTreinos atualizarCompleto(Long id, HistoricoTreinos dados, Long usuarioId, Long treinoId) {
        HistoricoTreinos existente = buscarPorId(id);

        // obrigatórios (todos devem vir no PUT completo)
        existente.setData(Objects.requireNonNull(dados.getData(), "data não pode ser nula"));
        existente.setTempo(Objects.requireNonNull(dados.getTempo(), "tempo não pode ser nulo"));
        existente.setVMedia(Objects.requireNonNull(dados.getVMedia(), "vMedia não pode ser nula"));
        existente.setDistancia(Objects.requireNonNull(dados.getDistancia(), "distancia não pode ser nula"));
        existente.setKcal(Objects.requireNonNull(dados.getKcal(), "kcal não pode ser nula"));
        existente.setPace(Objects.requireNonNull(dados.getPace(), "pace não pode ser nula"));

        if (usuarioId != null) {
            existente.setUsuario(usuariosService.buscarPorId(usuarioId));
        }
        if (treinoId != null) {
            existente.setTreino(treinosService.buscarPorId(treinoId));
        }

        return historicoRepository.save(existente);
    }

    // =========================
    // DELETE
    // =========================
    @Transactional
    public void excluir(Long id) {
        HistoricoTreinos historico = buscarPorId(id);
        // apaga pontos associados primeiro (FK)
        pontosRepository.deleteByHistoricoTreinoId(historico.getId());
        historicoRepository.delete(historico);
    }

    // =========================
    // READs
    // =========================
    public HistoricoTreinos buscarPorId(Long id) {
        return historicoRepository.findById(id)
                .orElseThrow(() -> new NotFound("Histórico não encontrado: " + id));
    }

    public List<HistoricoTreinos> listarPorUsuario(Long usuarioId) {
        return historicoRepository.findByUsuarioId(usuarioId);
    }

    public Page<HistoricoTreinos> listarPorUsuario(Long usuarioId, Pageable pageable) {
        return historicoRepository.findByUsuarioId(usuarioId, pageable);
    }
}
