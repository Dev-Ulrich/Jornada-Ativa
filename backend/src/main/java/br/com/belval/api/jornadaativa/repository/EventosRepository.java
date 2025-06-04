package br.com.belval.api.jornadaativa.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import br.com.belval.api.jornadaativa.model.Eventos;

public interface EventosRepository extends CrudRepository<Eventos, Integer> {

    List<Eventos> findByNomeContainingIgnoreCase(String nome);

}
