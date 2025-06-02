package br.com.belval.api.jornadaativa.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.repository.CrudRepository;

import br.com.belval.api.jornadaativa.model.Treino;

public interface TreinoRepository extends CrudRepository<Treino, Integer > {
	

    List<Treino> findByData(LocalDate data);

    List<Treino> findByDistanciaGreaterThan(Double distancia);

    List<Treino> findByTempoLessThan(Long tempo);

}
