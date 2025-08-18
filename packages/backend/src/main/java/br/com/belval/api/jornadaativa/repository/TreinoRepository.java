package br.com.belval.api.jornadaativa.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.belval.api.jornadaativa.model.Treino;
import ch.qos.logback.core.util.Duration;

@Repository
public interface TreinoRepository extends JpaRepository<Treino, Long> {

    // Buscar treinos por nomes
    List<Treino> findByNome(String nome);

    // Buscar treinos por data
    List<Treino> findByData(LocalDate data);

    // Buscar treinos com distância maior que o valor informado
    List<Treino> findByDistanciaGreaterThan(BigDecimal distancia);

    // Buscar treinos com tempo menor que o valor informado
    List<Treino> findByTempoLessThan(Duration tempo);

}
