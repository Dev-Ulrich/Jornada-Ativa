package br.com.belval.api.jornadaativa.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import br.com.belval.api.jornadaativa.model.Eventos;
import java.time.LocalDateTime;
import java.time.LocalDate;

public interface EventosRepository extends CrudRepository<Eventos, Integer> {

    List<Eventos> findByNomeContainingIgnoreCase(String nome);

    List<Eventos> findByCreatedAt(LocalDateTime createdAt);

    List<Eventos> findByDataEvento(LocalDate dataEvento);
}
