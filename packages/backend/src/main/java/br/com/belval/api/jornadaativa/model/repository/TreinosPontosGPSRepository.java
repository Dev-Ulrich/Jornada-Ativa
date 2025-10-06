package br.com.belval.api.jornadaativa.model.repository;


import br.com.belval.api.jornadaativa.model.entity.TreinosPontosGPS;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface TreinosPontosGPSRepository extends JpaRepository<TreinosPontosGPS, Long> {

    // pontos de um histórico específico (para montar o trajeto)
    List<TreinosPontosGPS> findByHistoricoTreinoId(Long historicoTreinoId);

    // caso precise apagar em cascata via repositório
    long deleteByHistoricoTreinoId(Long historicoTreinoId);
}
