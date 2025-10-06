package br.com.belval.api.jornadaativa.model.service;


import br.com.belval.api.jornadaativa.exceptions.NotFound;
import br.com.belval.api.jornadaativa.model.entity.TreinosPontosGPS;
import br.com.belval.api.jornadaativa.model.repository.TreinosPontosGPSRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TreinosPontosGPSService {

    private final TreinosPontosGPSRepository pontosRepository;

    @Transactional
    public List<TreinosPontosGPS> adicionarEmLote(List<TreinosPontosGPS> pontos) {
        return pontosRepository.saveAll(pontos);
    }

    public List<TreinosPontosGPS> buscarPorHistorico(Long historicoId) {
        return pontosRepository.findByHistoricoTreinoId(historicoId);
    }

    @Transactional
    public long excluirPorHistorico(Long historicoId) {
        return pontosRepository.deleteByHistoricoTreinoId(historicoId);
    }

    public TreinosPontosGPS buscarPorId(Long id) {
        return pontosRepository.findById(id)
                .orElseThrow(() -> new NotFound("Ponto GPS não encontrado: " + id));
    }
}

