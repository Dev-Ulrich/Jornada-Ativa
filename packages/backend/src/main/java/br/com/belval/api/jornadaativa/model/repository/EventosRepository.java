package br.com.belval.api.jornadaativa.model.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.time.LocalDate;

import org.springframework.stereotype.Repository;

import br.com.belval.api.jornadaativa.model.entity.Eventos;

@Repository
public interface EventosRepository extends JpaRepository<Eventos, Long> {

}
