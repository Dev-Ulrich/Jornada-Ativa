package br.com.belval.api.jornadaativa.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.repository.CrudRepository;

import br.com.belval.api.jornadaativa.model.Treinos;

public interface TreinoRepository extends CrudRepository<Treinos, Integer > {
	

    List<Treinos> findByData(LocalDate data);

    List<Treinos> findByDistanciaGreaterThan(Double distancia);

    List<Treinos> findByTempoLessThan(Long tempo);

}
