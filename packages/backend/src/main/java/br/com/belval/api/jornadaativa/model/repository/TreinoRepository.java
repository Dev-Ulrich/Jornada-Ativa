package br.com.belval.api.jornadaativa.model.repository;

import java.time.LocalDate;
import java.util.List;


import org.springframework.stereotype.Repository;

import br.com.belval.api.jornadaativa.model.entity.Treino;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface TreinoRepository extends JpaRepository<Treino, Long> {

}
