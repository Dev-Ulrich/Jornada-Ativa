package br.com.belval.api.jornadaativa.repository;

import org.springframework.data.jpa.repository.JpaRepository;


import br.com.belval.api.jornadaativa.model.HistoricoTreino;

import java.util.List;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.stereotype.Repository;

@Repository
public interface HistoricoTreinoRepository extends JpaRepository<HistoricoTreino, Integer> {

    List<HistoricoTreino> findByIdHistoricoTreino(Long idHistoricoTreino);

    List<HistoricoTreino> findByData(LocalDate data);

    List<HistoricoTreino> findByDistancia(BigDecimal distancia);

    List<HistoricoTreino> findByPace(BigDecimal pace);

    List<HistoricoTreino> findByCreatedAt(LocalDateTime createdAt);
}
