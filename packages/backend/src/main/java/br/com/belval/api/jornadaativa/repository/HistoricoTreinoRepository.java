package br.com.belval.api.jornadaativa.repository;

import org.springframework.data.repository.CrudRepository;

import br.com.belval.api.jornadaativa.model.HistoricoTreino;
import java.util.List;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface HistoricoTreinoRepository extends CrudRepository<HistoricoTreino, Integer> {

    List<HistoricoTreino> findByIdHistoricoTreino(Long idHistoricoTreino);

    List<HistoricoTreino> findByData(LocalDate data);

    List<HistoricoTreino> findByDistancia(BigDecimal distancia);

    List<HistoricoTreino> findByCreatedAt(LocalDateTime createdAt);
}
