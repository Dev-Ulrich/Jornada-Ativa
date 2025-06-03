package br.com.belval.api.jornadaativa.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import br.com.belval.api.jornadaativa.model.TipoTreinos;

public interface TipoTreinoRepository extends CrudRepository<TipoTreinos, Integer> {

    List<TipoTreinos> findByResistenciaContainingIgnoreCase(String resistencia);

    List<TipoTreinos> findByCaminhadaContainingIgnoreCase(String caminhada);
}