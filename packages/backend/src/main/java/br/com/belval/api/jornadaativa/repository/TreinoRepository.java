package br.com.belval.api.jornadaativa.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.belval.api.jornadaativa.model.Treino;

import java.time.LocalDateTime;

import org.springframework.data.repository.CrudRepository;

@Repository
public interface TreinoRepository extends CrudRepository<Treino, Long> {

    List<Treino> findByNome(String nome);

    List<Treino> findByCreatedAt(LocalDateTime createdAt);

}
