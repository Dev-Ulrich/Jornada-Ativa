package br.com.belval.api.jornadaativa.model.service;


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

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HistoricoTreinosService {

    private final HistoricoTreinosRepository historicoRepository;
    private final TreinosPontosGPSRepository pontosRepository;
    private final UsuariosService usuariosService;
    private final TreinosService treinosService;

    @Transactional
    public HistoricoTreinos lancar(Long usuarioId, Long treinoId, HistoricoTreinos dados, List<TreinosPontosGPS> pontos) {
        Usuarios usuario = usuariosService.buscarPorId(usuarioId);
        dados.setUsuario(usuario);

        if (treinoId != null) {
            Treinos treino = treinosService.buscarPorId(treinoId);
            dados.setTreino(treino);
        }

        HistoricoTreinos salvo = historicoRepository.save(dados);

        if (pontos != null && !pontos.isEmpty()) {
            for (TreinosPontosGPS p : pontos) {
                p.setHistoricoTreino(salvo);
            }
            pontosRepository.saveAll(pontos);
        }
        return salvo;
    }

    @Transactional
    public HistoricoTreinos atualizar(Long id, HistoricoTreinos dados) {
        HistoricoTreinos historico = buscarPorId(id);

        historico.setData(dados.getData());
        historico.setTempo(dados.getTempo());
        historico.setVMedia(dados.getVMedia());
        historico.setDistancia(dados.getDistancia());
        historico.setKcal(dados.getKcal());
        historico.setPace(dados.getPace());

        return historicoRepository.save(historico);
    }

    @Transactional
    public void excluir(Long id) {
        HistoricoTreinos historico = buscarPorId(id);
        pontosRepository.deleteByHistoricoTreinoId(historico.getId());
        historicoRepository.delete(historico);
    }

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
