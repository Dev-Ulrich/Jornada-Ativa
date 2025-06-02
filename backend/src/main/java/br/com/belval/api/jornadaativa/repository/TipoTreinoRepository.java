package br.com.belval.api.jornadaativa.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import br.com.belval.api.jornadaativa.model.TipoTreino;

public interface TipoTreinoRepository extends CrudRepository<TipoTreino, Integer> {

    List<TipoTreino> findByResistenciaContainingIgnoreCase(String resistencia);

    List<TipoTreino> findByCaminhadaContainingIgnoreCase(String caminhada);
}