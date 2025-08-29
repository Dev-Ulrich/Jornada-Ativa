package br.com.belval.api.jornadaativa.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;


import br.com.belval.api.jornadaativa.model.Eventos;

import java.time.LocalDateTime;
import java.time.LocalDate;

import org.springframework.stereotype.Repository;

@Repository
public interface EventosRepository extends JpaRepository<Eventos, Integer> {

    List<Eventos> findByNomeContainingIgnoreCase(String nome);

    List<Eventos> findByIdEvento(Long idEvento);

    List<Eventos> findByCreatedAt(LocalDateTime createdAt);

    List<Eventos> findByDataEvento(LocalDate dataEvento);
}
