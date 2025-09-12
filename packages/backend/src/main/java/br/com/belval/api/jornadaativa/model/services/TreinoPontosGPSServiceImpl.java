package br.com.belval.api.jornadaativa.model.services;

import br.com.belval.api.jornadaativa.exceptions.NotFound;
import br.com.belval.api.jornadaativa.model.entity.TreinoPontosGPS;
import br.com.belval.api.jornadaativa.model.repository.TreinoPontosGpsRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class TreinoPontosGPSServiceImpl implements TreinoPontosGPSService {

    private final TreinoPontosGpsRepository treinoPontosGpsRepository;

    @Override
    public TreinoPontosGPS findById(Long id) {
        return treinoPontosGpsRepository.findById(id)
                .orElseThrow(() -> new NotFound("Ponto não encontrado com o id " + id));
    }

    @Override
    public List<TreinoPontosGPS> findAll() {
        return treinoPontosGpsRepository.findAll();
    }

    @Override
    public TreinoPontosGPS save(TreinoPontosGPS treinoPontosGPS) {
        return treinoPontosGpsRepository.save(treinoPontosGPS);
    }

    @Override
    public void delete(Long id) {
        if (!treinoPontosGpsRepository.existsById(id)) {
            throw new NotFound("Ponto não encontrado com o id " + id);
        }
        treinoPontosGpsRepository.deleteById(id);
    }

    @Override
    public TreinoPontosGPS update(TreinoPontosGPS treinoPontosGPS, Long id) {
        TreinoPontosGPS atual = findById(id);
        atual.setLatitude(treinoPontosGPS.getLatitude());
        atual.setLongitude(treinoPontosGPS.getLongitude());
        atual.setMomento(treinoPontosGPS.getMomento());
        atual.setHistoricoTreino(treinoPontosGPS.getHistoricoTreino());
        return treinoPontosGpsRepository.save(atual);
    }
}