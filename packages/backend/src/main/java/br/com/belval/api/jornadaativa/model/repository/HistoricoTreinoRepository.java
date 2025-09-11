package br.com.belval.api.jornadaativa.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.stereotype.Repository;

import br.com.belval.api.jornadaativa.model.entity.HistoricoTreino;

@Repository
public interface HistoricoTreinoRepository extends JpaRepository<HistoricoTreino, Long> {

}
